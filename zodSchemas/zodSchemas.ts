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
  age: z.string().min(2),
  bio: z.string().min(2)
});

export const beerSchema = z.object({
  name: z.string().min(3),
  brewery: z.string().min(3),
  type: z.string().min(3),
  ibu: z.number(),
  abv: z.number(),
  og: z.number(),
  volume: z.number(),
  format: z.string().min(3).refine(value => value === "Банка" || value === "Бутылка" || value === "Розлив", {
    message: "Формат может быть только 'Банка', 'Бутылка' или 'Розлив'",
  }),
  image: z.string().min(1),
})

export const reviewSchema = z.object({
  title: z.string().min(3),
  body: z.string().min(3),
  rating: z.number().min(1.0).max(5.0)
})

export const beersQuerySchema = z.object({
  page: z.string().regex(/^[1-9][0-9]{0,2}$/),
  per_page: z.string().regex(/^[1-9][0-9]{0,2}$/)
});
