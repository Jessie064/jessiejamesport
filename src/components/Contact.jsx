import { ArrowUpRightIcon, EnvelopeSimpleIcon, FacebookLogoIcon, GithubLogoIcon, LinkedinLogoIcon, AsteriskIcon } from '@phosphor-icons/react';
import { contact, validWebUrl, validEmail } from '../data/portfolio';

export default function Contact() {
  const links = [
    ...(validWebUrl(contact.facebook) ? [{ label: 'Facebook', detail: 'Connect with me', url: contact.facebook, Icon: FacebookLogoIcon, external: true }] : []),
    ...(validEmail(contact.email) ? [{ label: 'Email me', detail: contact.email, url: `mailto:${contact.email}`, Icon: EnvelopeSimpleIcon, external: false }] : []),
    ...(validWebUrl(contact.github) ? [{ label: 'GitHub', detail: 'Explore my code', url: contact.github, Icon: GithubLogoIcon, external: true }] : []),
    ...(validWebUrl(contact.linkedin) ? [{ label: 'LinkedIn', detail: 'Let’s connect', url: contact.linkedin, Icon: LinkedinLogoIcon, external: true }] : []),
  ];
  return (
    <section id="contact" className="contact-section section-anchor" aria-labelledby="contact-title" tabIndex={-1}>
      <div className="contact-copy"><p className="eyebrow"><span className="section-number">04</span>Let’s connect</p><h2 id="contact-title">{contact.heading}</h2><p>{contact.introduction}</p></div>
      <div className="contact-actions">
        <AsteriskIcon className="contact-asterisk" size={52} weight="light" aria-hidden="true" />
        {links.length > 0 ? <div className="contact-links">{links.map(({ label, detail, url, Icon, external }) => <a href={url} key={label} target={external ? '_blank' : undefined} rel={external ? 'noopener noreferrer' : undefined}><Icon size={23} aria-hidden="true" /><span><strong>{label}</strong><small>{detail}</small></span><ArrowUpRightIcon size={20} aria-hidden="true" />{external && <span className="sr-only">(opens in a new tab)</span>}</a>)}</div> : <div className="contact-pending"><EnvelopeSimpleIcon size={24} weight="light" /><div><p>{contact.pendingMessage}</p><span>My little corner of the internet is still growing.</span></div></div>}
      </div>
    </section>
  );
}
