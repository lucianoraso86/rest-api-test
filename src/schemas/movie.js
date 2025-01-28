import z from "zod";

const movieSchema = z.object({
  title: z.string().nonempty({ message: "Title is required" }),
  genre: z.array(
    z
      .string()
      .transform((val) => val.toLowerCase())
      .refine(
        (val) =>
          [
            "action",
            "crime",
            "comedy",
            "drama",
            "fantasy",
            "horror",
            "mystery",
            "romance",
            "thriller",
            "western",
          ].includes(val),
        {
          message: "Invalid genre",
        }
      )
  ),
  year: z.number().int().min(1888).max(2030),
  director: z.string().nonempty(),
  duration: z.number().int().positive(),
  rate: z.number().min(0).max(10).default(5),
  poster: z.string().url({
    message: "Invalid URL format",
  }),
});

export const validateMovie = (object) => {
  return movieSchema.safeParse(object);
};

export const validatePartialMovie = (object) => {
  return movieSchema.partial().safeParse(object);
};

