import {
	createWorkspaceSchema,
	updateWorkspaceSchema,
	workspacesQuerySchema,
} from '@power-paint/contracts'
import { createZodDto } from 'nestjs-zod'

export class CreateWorkspaceDto extends createZodDto(createWorkspaceSchema) {}
export class UpdateWorkspaceDto extends createZodDto(updateWorkspaceSchema) {}
export class WorkspacesQueryDto extends createZodDto(workspacesQuerySchema) {}
