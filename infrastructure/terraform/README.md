# Terraform Configuration for Event Booking Application

This directory contains Terraform configuration files to provision the infrastructure for the Event Booking application on AWS using free tier resources.

## Prerequisites

1. AWS CLI installed and configured with appropriate credentials
2. Terraform installed (version >= 1.0.0)
3. SSH key pair for EC2 instance access

## Configuration

1. Generate an SSH key pair:
   ```bash
   ssh-keygen -t rsa -b 2048 -f kubernetes-key
   ```

2. Move the public key to the terraform directory:
   ```bash
   mv kubernetes-key.pub infrastructure/terraform/
   ```

3. Keep the private key (`kubernetes-key`) secure and use it to SSH into the instance.

## Usage

1. Initialize Terraform:
   ```bash
   terraform init
   ```

2. Review the planned changes:
   ```bash
   terraform plan
   ```

3. Apply the configuration:
   ```bash
   terraform apply
   ```

4. After successful application, Terraform will output:
   - EC2 instance public IP
   - Instance ID
   - VPC ID
   - Subnet ID

5. SSH into the instance:
   ```bash
   ssh -i kubernetes-key ubuntu@<instance_public_ip>
   ```

## Resources Created

- VPC with public subnet
- Internet Gateway
- Route Table
- Security Group with necessary ports
- EC2 instance (t2.micro - free tier eligible)
- Key pair for SSH access

## Cleanup

To destroy all created resources:
```bash
terraform destroy
```

## Notes

- The configuration uses t2.micro instance type which is eligible for AWS free tier
- The root volume size is set to 8GB which is within free tier limits
- All necessary ports for the application are opened in the security group
- Docker is automatically installed on the instance via user data script 