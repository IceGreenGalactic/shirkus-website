export default {
  name: 'visitorLog',
  title: 'Besøk',
  type: 'document',
  readOnly: true,
  fields: [
    {name: 'ip', title: 'IP-adresse', type: 'string'},
    {
      name: 'lastSessionStart',
      title: 'Starttid for siste økt',
      type: 'datetime',
    },
    {
      name: 'visits',
      title: 'Besøk',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            {name: 'page', title: 'Side', type: 'string'},
            {name: 'date', title: 'Dato', type: 'date'},
            {name: 'count', title: 'Antall ganger', type: 'number'},
            {name: 'lastVisit', title: 'Sist besøkt', type: 'datetime'},
          ],
        },
      ],
    },
  ],
  // __experimental_hide: true,
}
