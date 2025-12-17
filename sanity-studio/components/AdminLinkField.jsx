import React from 'react'

export default function AdminLinkField(props) {
  const url = props.value
  return (
    <div style={{fontSize: 20, paddingTop: 6}}>
      {url ? (
        <a href={url} target="_blank" rel="noopener" style={{color: '#5F9EA0'}}>
          https://shirkus.no/admin
        </a>
      ) : (
        <em>Ingen link satt</em>
      )}
      <div style={{fontSize: 12, opacity: 0.7, marginTop: 6}}>
        trykk her og kom direkte til kontrollpanelet ditt
      </div>
    </div>
  )
}
