import React from 'react'

export function InfoBox() {
  return (
    <div style={{ padding: '1em', backgroundColor: '#20232eff', border: '1px solid #c7d2fe', borderRadius: '6px' }}>
      <strong>Admin Dashboard:</strong>{' '}
      <a href="https://shirkus.no/admin" target="_blank" rel="noopener noreferrer" style={{ color: '#3b82f6' }}>
        shirkus.no/admin
      </a>
    </div>
  )
}
