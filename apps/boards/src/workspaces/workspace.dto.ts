import {
	createWorkspaceSchema,
	updateWorkspaceSchema,
} from '@power-paint/contracts'
import { createZodDto } from 'nestjs-zod'

export class CreateWorkspaceDto extends createZodDto(createWorkspaceSchema) {}
export class UpdateWorkspaceDto extends createZodDto(updateWorkspaceSchema) {}
