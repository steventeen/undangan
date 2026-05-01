// Redirect /admin/templates/add → /admin/templates/edit/new
import { redirect } from 'next/navigation';

export default function AddTemplatePage() {
  redirect('/admin/templates/edit/new');
}
