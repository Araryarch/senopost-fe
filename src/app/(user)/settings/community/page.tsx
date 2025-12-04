import React, { Suspense } from 'react'
import CommunitySettingsPage from './community-settings'

export default function page() {
  return (
    <Suspense>
      <CommunitySettingsPage />
    </Suspense>
  )
}
