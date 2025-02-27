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
      type: 'date', // Kalender for valg av dato
      options: {
        dateFormat: 'DD.MM.YYYY', // Formaterer dato til ønsket format
      },
      description: 'Velg dato for fødsel.',
    },
    {
      name: 'expectedDateOfBirth',
      title: 'Forventet fødselsdato',
      type: 'date', // Kalender for valg av dato, men kan begrenses til måned og år.
      options: {
        dateFormat: 'MM.YYYY', // Viser måned og år
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
      name: 'galleryImages',
      title: 'Galleri bilder',
      type: 'array',
      of: [{type: 'image'}],
    },
    {
      name: 'textUnderMainImage',
      title: 'Tekst under hovedbilde',
      type: 'text', // Beskrivelse under hovedbilde.
    },
    {
      name: 'textUnderGallery',
      title: 'Tekst under galleri',
      type: 'text', // Beskrivelse under galleribilder.
    },
    {
      name: 'freeText1',
      title: 'ValpeInfo tekst',
      type: 'text', // Mulighet for fri tekst.
    },
    {
      name: 'freeText2',
      title: 'Fritekst 2',
      type: 'text', // Mulighet for fri tekst.
    },
  ],
}
