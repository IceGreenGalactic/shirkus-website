export default {
  name: 'dog',
  title: 'Dog',
  type: 'document',
  fields: [
    {
      name: 'name',
      title: 'Name',
      type: 'string',
    },
    {
      name: 'nickname',
      title: 'Nickname',
      type: 'string',
    },
    {
      name: 'breed',
      title: 'Breed',
      type: 'string',
    },
    {
      name: 'color',
      title: 'Color',
      type: 'string',
    },
    {
      name: 'gender',
      title: 'Gender',
      type: 'string',
      options: {
        list: [
          {title: 'Hann', value: 'Hann'},
          {title: 'Tispe', value: 'Tispe'},
        ],
      },
    },
    {
      name: 'dateOfBirth',
      title: 'Date of Birth',
      type: 'date',
    },
    {
      name: 'registrationNumber',
      title: 'Registration Number',
      type: 'string',
    },
    {
      name: 'healthResults',
      title: 'Helse Resultater',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'title',
              title: 'Tittel',
              type: 'string', // Her kan hun skrive inn tittel som HD, AD, NE, mentaltest osv.
            },
            {
              name: 'description',
              title: 'Beskrivelse',
              type: 'text', // Her kan hun skrive inn resultatet eller mer informasjon.
            },
          ],
        },
      ],
    },
    {
      name: 'image',
      title: 'Image',
      type: 'image',
      options: {
        hotspot: true,
      },
    },
    {
      name: 'pedigree',
      title: 'Pedigree',
      type: 'image',
    },
    {
      name: 'description',
      title: 'Description',
      type: 'text', // Generelt felt for fri tekst
    },
  ],
}
