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
      name: 'dateOfBirth',
      title: 'Fødselsdato',
      type: 'date',
      options: {
        dateFormat: 'DD.MM.YYYY',
      },
      description: 'Velg dato for fødsel.',
    },
    {
      name: 'expectedDateOfBirth',
      title: 'Forventet fødselsdato',
      type: 'date',
      options: {
        dateFormat: 'MM.YYYY',
        calendarTodayLabel: 'Forventet dato',
      },
      description: 'Velg forventet dato for fødsel (måned og år).',
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
                  {title: 'Hann', value: 'male'},
                  {title: 'Tispe', value: 'female'},
                ],
              },
            },
            {
              name: 'color',
              title: 'Farge',
              type: 'string',
              options: {
                list: [
                  {title: 'Hvit', value: 'white'},
                  {title: 'Grå', value: 'gray'},
                  {title: 'Sort', value: 'black'},
                ],
              },
            },
            {
              name: 'count',
              title: 'Antall',
              type: 'number',
              description: 'Antall valper av denne typen.',
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
      name: 'galleryImages1',
      title: 'Galleri 1 Bilder',
      type: 'array',
      of: [{type: 'image'}],
    },
    {
      name: 'textGallery1',
      title: 'Tekst under Galleri 1',
      type: 'text', 
    },
    {
      name: 'galleryTitle1',
      title: 'Tittel for Galleri 1',
      type: 'string', 
      description: 'Gi galleriet en passende tittel, f.eks. "Uke 1" eller annet.',
    },

    // Galleri 2
    {
      name: 'galleryImages2',
      title: 'Galleri 2 Bilder',
      type: 'array',
      of: [{type: 'image'}],
    },
    {
      name: 'textGallery2',
      title: 'Tekst under Galleri 2',
      type: 'text', 
    },
    {
      name: 'galleryTitle2',
      title: 'Tittel for Galleri 2',
      type: 'string', 
      description: 'Gi galleriet en passende tittel, f.eks. "Uke 2" eller annet.',
    },

    // Galleri 3
    {
      name: 'galleryImages3',
      title: 'Galleri 3 Bilder',
      type: 'array',
      of: [{type: 'image'}],
    },
    {
      name: 'textGallery3',
      title: 'Tekst under Galleri 3',
      type: 'text', 
    },
    {
      name: 'galleryTitle3',
      title: 'Tittel for Galleri 3',
      type: 'string', 
      description: 'Gi galleriet en passende tittel, f.eks. "Uke 3" eller annet.',
    },

    // Galleri 4
    {
      name: 'galleryImages4',
      title: 'Galleri 4 Bilder',
      type: 'array',
      of: [{type: 'image'}],
    },
    {
      name: 'textGallery4',
      title: 'Tekst under Galleri 4',
      type: 'text', 
    },
    {
      name: 'galleryTitle4',
      title: 'Tittel for Galleri 4',
      type: 'string', 
      description: 'Gi galleriet en passende tittel, f.eks. "Uke 4" eller annet.',
    },

    // Galleri 5
    {
      name: 'galleryImages5',
      title: 'Galleri 5 Bilder',
      type: 'array',
      of: [{type: 'image'}],
    },
    {
      name: 'textGallery5',
      title: 'Tekst under Galleri 5',
      type: 'text', 
    },
    {
      name: 'galleryTitle5',
      title: 'Tittel for Galleri 5',
      type: 'string', 
      description: 'Gi galleriet en passende tittel, f.eks. "Uke 5" eller annet.',
    },

    // Galleri 6
    {
      name: 'galleryImages6',
      title: 'Galleri 6 Bilder',
      type: 'array',
      of: [{type: 'image'}],
    },
    {
      name: 'textGallery6',
      title: 'Tekst under Galleri 6',
      type: 'text', 
    },
    {
      name: 'galleryTitle6',
      title: 'Tittel for Galleri 6',
      type: 'string', 
      description: 'Gi galleriet en passende tittel, f.eks. "Uke 6" eller annet.',
    },

    // Galleri 7
    {
      name: 'galleryImages7',
      title: 'Galleri 7 Bilder',
      type: 'array',
      of: [{type: 'image'}],
    },
    {
      name: 'textGallery7',
      title: 'Tekst under Galleri 7',
      type: 'text', 
    },
    {
      name: 'galleryTitle7',
      title: 'Tittel for Galleri 7',
      type: 'string', 
      description: 'Gi galleriet en passende tittel, f.eks. "Uke 7" eller annet.',
    },

    // Galleri 8
    {
      name: 'galleryImages8',
      title: 'Galleri 8 Bilder',
      type: 'array',
      of: [{type: 'image'}],
    },
    {
      name: 'textGallery8',
      title: 'Tekst under Galleri 8',
      type: 'text', 
    },
    {
      name: 'galleryTitle8',
      title: 'Tittel for Galleri 8',
      type: 'string', 
      description: 'Gi galleriet en passende tittel, f.eks. "Uke 8" eller annet.',
    },

    // Galleri 9
    {
      name: 'galleryImages9',
      title: 'Galleri 9 Bilder',
      type: 'array',
      of: [{type: 'image'}],
    },
    {
      name: 'textGallery9',
      title: 'Tekst under Galleri 9',
      type: 'text', 
    },
    {
      name: 'galleryTitle9',
      title: 'Tittel for Galleri 9',
      type: 'string', 
      description: 'Gi galleriet en passende tittel, f.eks. "Uke 9" eller annet.',
    },

    // Galleri 10
    {
      name: 'galleryImages10',
      title: 'Galleri 10 Bilder',
      type: 'array',
      of: [{type: 'image'}],
    },
    {
      name: 'textGallery10',
      title: 'Tekst under Galleri 10',
      type: 'text', 
    },
    {
      name: 'galleryTitle10',
      title: 'Tittel for Galleri 10',
      type: 'string', 
      description: 'Gi galleriet en passende tittel, f.eks. "Uke 10" eller annet.',
    },
  ],
}
