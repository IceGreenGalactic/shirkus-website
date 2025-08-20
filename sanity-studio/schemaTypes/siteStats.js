import {InfoBox} from '../components/InfoBox'

export default {
  name: 'siteStats',
  title: 'Besøksstatistikk',
  type: 'document',
  fields: [
    {
      name: 'adminInfo',
      type: 'string',
      title: ' ',
      readOnly: true,
      components: {
        field: InfoBox,
      },
    },
    {
      name: 'visitors',
      title: 'Totale besøk',
      type: 'number',
      initialValue: 0,
      readOnly: true,
    },
  ],
  preview: {
    select: {
      visitors: 'visitors',
    },
    prepare({visitors}) {
      return {
        title: `Totale besøk: ${visitors ?? 0}`,
      }
    },
  },
}
