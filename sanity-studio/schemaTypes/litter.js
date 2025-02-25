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
  