import { ListWebPage } from '@/pages/list-web'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_auth/list-web/')({
    component: ListWebPage,
})
