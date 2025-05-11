terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

provider "aws" {
  region = var.aws_region
}

# default VPC
data "aws_vpc" "default" {
  default = true
}

# Get the default subnet
data "aws_subnet" "default" {
  vpc_id = data.aws_vpc.default.id
  availability_zone = "${var.aws_region}a"
}

# Create security group
resource "aws_security_group" "kubernetes" {
  name        = "kubernetes-sg"
  description = "Security group for Kubernetes cluster"
  vpc_id      = data.aws_vpc.default.id

  # SSH access
  ingress {
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  # HTTP/HTTPS for Ingress
  ingress {
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    from_port   = 443
    to_port     = 443
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  # All outbound traffic
  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name = "kubernetes-sg"
  }
}

# Create EC2 instance
resource "aws_instance" "kubernetes" {
  ami           = var.ami_id
  instance_type = var.instance_type
  key_name      = aws_key_pair.kubernetes.key_name

  subnet_id                   = data.aws_subnet.default.id
  vpc_security_group_ids      = [aws_security_group.kubernetes.id]
  associate_public_ip_address = true

  root_block_device {
    volume_size = var.root_volume_size
    volume_type = "gp2"
  }

  tags = {
    Name = "kubernetes-master"
  }
}

# Create key pair
resource "aws_key_pair" "kubernetes" {
  key_name   = "kubernetes-key"
  public_key = file(var.ssh_public_key_path)
} 