import { z} from 'zod'

export const userRegistrationSchema = z.object({
  nickName: z.string().min(1),
  email: z.string().email(),
  password: z.string().min(6)
})

export const userLoginSchema = z.object({
  nickName: z.string().min(1),
  password: z.string().min(6)
})

export const profileSchema = z.object({
  realName: z.string().min(1),
  age: z.number().min(18),
  bio: z.string().min(1),
  avatar: z.string().optional()
});

export const beerSchema = z.object({
  name: z.string().min(1),
  brewery: z.string().min(1),
  type: z.string().min(1),
  abv: z.number().min(0).max(100),
  volume: z.number(),
  image: z.string().optional()
})

export const reviewSchema = z.object({
  title: z.string().min(3),
  body: z.string().min(3),
  rating: z.number().min(1.0).max(5.0)
})

