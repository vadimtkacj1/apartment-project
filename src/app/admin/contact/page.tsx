import { redirect } from 'next/navigation';

export default function ContactRedirect() {
  redirect('/admin/contact/contact-info');
}
