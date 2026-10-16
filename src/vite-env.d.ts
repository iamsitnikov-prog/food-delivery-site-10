/// <reference types="vite/client" />

declare module "petrovich" {
  type Person = { first?: string; middle?: string; last?: string; gender?: "male" | "female" | "androgynous" };
  const petrovich: (person: Person, gcase: "genitive" | "dative" | "accusative" | "instrumental" | "prepositional") => Required<Person>;
  export default petrovich;
}
