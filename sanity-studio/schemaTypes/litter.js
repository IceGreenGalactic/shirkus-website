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
        dateFormat: 'DD.MM.YYYY',
        calendarTodayLabel: 'Forventet dato',
      },
      description: 'Velg forventet dato for fødsel.',
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
                validation: (Rule) =>
                  Rule.required().error('Kjønn må velges for hver valp'),                
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
                validation: (Rule) =>
                  Rule.required().error('Farge må velges for hver valp'), 
              },
            },
            {
              name: 'count',
              title: 'Antall',
              type: 'number',
              description: 'Antall valper av denne typen.',
              validation: (Rule) =>
                Rule.min(1).integer().error('Antall må være et positivt heltall'),
            },
          ],
        },
      ],
    },

    {
      name: 'freeText1',
      title: 'ValpeInfo tekst',
      type: 'text',
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
      name: 'galleries',
      title: 'Gallerier',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'title',
              title: 'Tittel for Galleri',
              type: 'string',
              description:
                'Gi galleriet en passende tittel, f.eks. "Uke 1, uke2 osv (maks 10 gallerier)".',
            },
            {
              name: 'images',
              title: 'Bilder',
              type: 'array',
              of: [{type: 'image', options: {hotspot: true}}],
              validation: (Rule) => Rule.max(8).warning('Maks 8 bilder per galleri'),
              description: 'Legg til bilder fra valpens utvikling. Maks 8 bilder pr galleri'

            },
            {
              name: 'description',
              title: 'Tekst under Galleri',
              type: 'text',
            },
          ],
        },
      ],
      validation: (Rule) => Rule.max(10).warning('Maks 10 gallerier'),
    },

    {
      name: 'freeText2',
      title: 'Fritekst 2',
      type: 'text',
    },
  ],
  preview: {
    select: {
      title: 'mother.nickname',
      subtitle: 'father.nickname',
      media: 'mainImage',
    },
    prepare(selection) {
      const {title, subtitle, media} = selection
      return {
        title: title || 'Uten navn',
        subtitle: subtitle || 'Ingen far oppgitt',
        media: media || 'no-image-icon',
      }
    },
  },
}
