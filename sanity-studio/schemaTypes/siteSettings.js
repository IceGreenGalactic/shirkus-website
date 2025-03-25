export default {
  name: 'siteSettings',
  title: 'Admin farger',
  type: 'document',
  fields: [
    {
      name: 'info',
      title: '🖌 Veiledning for farger',
      type: 'string',
      readOnly: true,
      initialValue:
        'https://htmlcolorcodes.com/ - skriv # + hex kode for å endre farge, RGBA = R + G + B + 0,8',
    },
    {
      name: 'primaryColor',
      title: 'Primærfarge (tekst)',
      type: 'string',
      description: 'Fargen som brukes for hovedteksten. Format: HEX (f.eks. #725A7A).',
      initialValue: '#725A7A',
    },
    {
      name: 'secondaryColor',
      title: 'Sekundærfarge (bakgrunn)',
      type: 'string',
      description: 'Bakgrunnsfargen på nettsiden. Format: HEX (f.eks. #9F7D94).',
      initialValue: '#9F7D94',
    },
    {
      name: 'accentColor',
      title: 'Aksentfarge (knapper og lenker)',
      type: 'string',
      description:
        'Fargen som brukes for overskrifter og mobil meny. Format: HEX (f.eks. #cc9fbd).',
      initialValue: '#cc9fbd',
    },
    {
      name: 'accentTransparent',
      title: 'Gjennomsiktig aksentfarge',
      type: 'string',
      description:
        'Bruk en RGBA-fargekode for en gjennomsiktig variant av aksentfargen. Format: rgba(R, G, B, A) (f.eks. rgba(176, 136, 163, 0.8)).',
      initialValue: 'rgba(176, 136, 163, 0.8)',
    },
    {
      name: 'textColor',
      title: 'Tekstfarge',
      type: 'string',
      description: 'Fargen på tekst. Format: HEX (f.eks. #343434).',
      initialValue: '#343434',
    },
    {
      name: 'titleColor',
      title: 'Overskriftfarge',
      type: 'string',
      description: 'Fargen på under overskrifter. Format: HEX (f.eks. #DA627D).',
      initialValue: '#DA627D',
    },
    {
      name: 'backgroundColor',
      title: 'Bakgrunnsfarge',
      type: 'string',
      description: 'Fargen som brukes som bakgrunn. Format: HEX (f.eks. #F9F9F9).',
      initialValue: '#F9F9F9',
    },
  ],
}
