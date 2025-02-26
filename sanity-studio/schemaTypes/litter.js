export default {
  name: 'litter',
  title: 'Kull',
  type: 'document',
  fields: [
    {
      name: 'mother',
      title: 'Mor',
      type: 'object',
      fields: [
        {
          name: 'name',
          title: 'Navn',
          type: 'string',
        },
        {
          name: 'nickname',
          title: 'Kallenavn',
          type: 'string',
        },
        {
          name: 'image',
          title: 'Bilde',
          type: 'image',
          options: {
            hotspot: true,
          },
        },
        {
          name: 'info',
          title: 'Info',
          type: 'text',
        },
      ],
    },
    {
      name: 'father',
      title: 'Far',
      type: 'object',
      fields: [
        {
          name: 'name',
          title: 'Navn',
          type: 'string',
        },
        {
          name: 'nickname',
          title: 'Kallenavn',
          type: 'string',
        },
        {
          name: 'image',
          title: 'Bilde',
          type: 'image',
          options: {
            hotspot: true,
          },
        },
        {
          name: 'info',
          title: 'Info',
          type: 'text',
        },
      ],
    },
    {
      name: 'puppyCount',
      title: 'Antall valper',
      type: 'number',
    },
    {
      name: 'expectedPuppies',
      title: 'Forventede valper',
      type: 'text', // Her kan hun skrive tekst om forventede valper.
    },
    {
      name: 'puppyDetails',
      title: 'Detaljer om valper',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'gender',
              title: 'Kjønn',
              type: 'string',
              options: {
                list: [
                  { title: 'Hann', value: 'male' },
                  { title: 'Tispe', value: 'female' },
                ],
              },
            },
            {
              name: 'color',
              title: 'Farge',
              type: 'string',
            },
            {
              name: 'count',
              title: 'Antall',
              type: 'number',
            },
          ],
        },
      ],
    },
    {
      name: 'dateOfBirth',
      title: 'Dato født',
      type: 'string',
      description: 'Skriv dato som dd.mm.åå eller måned og år (f.eks. 05.03.23 eller mars 2023)',
      validation: (Rule) => Rule.regex(/^(0[1-9]|[12][0-9]|3[01])\.(0[1-9]|1[0-2])\.(\d{2})$|^([A-Za-z]+)\s\d{4}$/, {
        name: 'date or month and year', // Custom error message
        message: 'Må være i formatet dd.mm.åå eller måned år (f.eks. 05.03.23 eller mars 2023)',
      }),
    },
    {
      name: 'mainImage',
      title: 'Hovedbilde',
      type: 'image',
      options: {
        hotspot: true,
      },
    },
    {
      name: 'additionalImages',
      title: 'Ekstra bilder',
      type: 'array',
      of: [{ type: 'image' }],
    },
    {
      name: 'textUnderImages',
      title: 'Tekst under bilder',
      type: 'text', // Fri tekst for beskrivelser under bildene.
    },
  ],
};
