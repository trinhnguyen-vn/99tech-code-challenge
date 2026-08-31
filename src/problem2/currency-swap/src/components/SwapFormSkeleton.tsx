import Skeleton from '@mui/material/Skeleton'
import Stack from '@mui/material/Stack'

function FieldSkeleton() {
  return (
    <Stack spacing={1} sx={{ flex: 1, minWidth: 0 }}>
      <Skeleton variant="text" width={60} />
      <Stack direction="row" spacing={1}>
        <Skeleton variant="rounded" width={140} height={40} />
        <Skeleton variant="rounded" height={40} sx={{ flex: 1 }} />
      </Stack>
    </Stack>
  )
}

export function SwapFormSkeleton() {
  return (
    <Stack spacing={2}>
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        spacing={2}
        sx={{ alignItems: { xs: 'stretch', sm: 'flex-end' } }}
      >
        <FieldSkeleton />
        <Skeleton
          variant="circular"
          width={40}
          height={40}
          sx={{ alignSelf: 'center', flexShrink: 0 }}
        />
        <FieldSkeleton />
      </Stack>

      <Skeleton variant="text" width={180} sx={{ alignSelf: 'center' }} />
      <Skeleton variant="rounded" height={44} />
    </Stack>
  )
}
