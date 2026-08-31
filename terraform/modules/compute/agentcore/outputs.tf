output "ecr_repository_url" {
  description = "ECR repository URL for the AgentCore image"
  value       = aws_ecr_repository.agentcore.repository_url
}

output "ecr_repository_name" {
  description = "ECR repository name"
  value       = aws_ecr_repository.agentcore.name
}

output "image_uri" {
  description = "Full image URI (with content-hash tag) built for the runtime"
  # DEPLOY NOTE (env-specific, dev): the AgentCore docker-build and runtime are
  # disabled because the arm64 image cannot be built in this sandbox (gnupg/
  # gpg-agent deadlocks under QEMU-user aarch64 emulation). Return the ECR image
  # URI the build WOULD produce so downstream references stay well-formed. The
  # image is not yet present in ECR; build it on a real arm64 host, then restore
  # module.agentcore_docker_build and awscc_bedrockagentcore_runtime.
  value = "${aws_ecr_repository.agentcore.repository_url}:${local.agentcore_image_tag}"
}

output "image_tag" {
  description = "Content-hash image tag"
  value       = local.agentcore_image_tag
}

output "v2_executions_table_name" {
  description = "v2 process/state DynamoDB table name"
  value       = aws_dynamodb_table.v2_executions.name
}

output "v2_executions_table_arn" {
  description = "v2 process/state DynamoDB table ARN"
  value       = aws_dynamodb_table.v2_executions.arn
}

output "runtime_arn" {
  description = "ARN of the Bedrock AgentCore Runtime"
  # DEPLOY NOTE (env-specific, dev): runtime disabled (image unbuildable in this
  # sandbox). Return a well-formed placeholder ARN so downstream IAM policies and
  # env vars remain valid; the runtime simply does not exist yet, so AI stage
  # execution is unavailable until the image is built and the runtime restored.
  value = "arn:${data.aws_partition.current.partition}:bedrock-agentcore:${data.aws_region.current.region}:${data.aws_caller_identity.current.account_id}:runtime/${replace("${var.project_name}_agentcore_${var.environment}", "-", "_")}"
}

output "runtime_id" {
  description = "Id of the Bedrock AgentCore Runtime"
  # DEPLOY NOTE (env-specific, dev): runtime disabled — placeholder id.
  value = "${replace("${var.project_name}_agentcore_${var.environment}", "-", "_")}-disabled"
}

output "role_arn" {
  description = "IAM execution role ARN for the runtime"
  value       = aws_iam_role.agentcore.arn
}
