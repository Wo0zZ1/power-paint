import { Locale } from '@power-paint/db'
import { createZodDto } from 'nestjs-zod'
import { z } from 'zod'

const hexColorRegex = /^#?([a-fA-F0-9]{3}|[a-fA-F0-9]{6})$/

const profileFields = {
	name: z.string().min(1).max(64),
	image: z.url().nullish(),
	phone: z.string().nullish(),
	locale: z.enum(Locale),
	preferredColor: z.string().regex(hexColorRegex),
}

// email приходит из auth и здесь не редактируется: источник истины - auth,
// профиль хранит только копию для отображения.
const createProfileSchema = z.object({
	userId: z.uuid(),
	email: z.email(),
	name: profileFields.name,
	image: profileFields.image,
	phone: profileFields.phone,
	locale: profileFields.locale.optional(),
	preferredColor: profileFields.preferredColor.optional(),
})

const updateProfileSchema = z.object({
	name: profileFields.name.optional(),
	image: profileFields.image,
	phone: profileFields.phone,
	locale: profileFields.locale.optional(),
	preferredColor: profileFields.preferredColor.optional(),
})

export class CreateProfileDto extends createZodDto(createProfileSchema) {}
export class UpdateProfileDto extends createZodDto(updateProfileSchema) {}
