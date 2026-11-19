'use strict';
const menuButton=document.querySelector('.menu-toggle');
const nav=document.querySelector('#primary-nav');
menuButton?.addEventListener('click',()=>{const isOpen=nav.classList.toggle('open');menuButton.setAttribute('aria-expanded',String(isOpen));menuButton.textContent=isOpen?'×':'☰';});
nav?.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{nav.classList.remove('open');menuButton?.setAttribute('aria-expanded','false');if(menuButton)menuButton.textContent='☰';}));
document.querySelector('#year').textContent=new Date().getFullYear();
//fetch('visitor-count.php',{method:'GET',cache:'no-store',credentials:'same-origin'}).then(async response=>{if(!response.ok)throw new Error('Counter unavailable');return response.json();}).then(data=>{if(typeof data.visits!=='number')throw new Error('Invalid counter');document.querySelector('#visitor-count').textContent=new Intl.NumberFormat('en-IN').format(data.visits);document.querySelector('#visitor-status').textContent='Total counted visits';}).catch(()=>{document.querySelector('#visitor-status').textContent='Counter temporarily unavailable';});
// Contact form uses the visitor's email client until a verified SMTP endpoint is configured.


/* AGNEX Digital Studio — GitHub Pages visitor counter */

const counterElement = document.querySelector('#visitor-count');
const counterStatus = document.querySelector('#visitor-status');

async function loadVisitorCount() {
  if (!counterElement || !counterStatus) return;

  try {
    const response = await fetch(
      'https://agnexdigital.goatcounter.com/counter/TOTAL.json',
      { cache: 'no-store' }
    );

    if (!response.ok) throw new Error('Counter unavailable');

    const data = await response.json();

    if (typeof data.count !== 'string' && typeof data.count !== 'number') {
      throw new Error('Invalid counter response');
    }

    counterElement.textContent = String(data.count);
    counterStatus.textContent = 'Total recorded page visits';
  } catch (error) {
    counterElement.textContent = '—';
    counterStatus.textContent = 'Visit count unavailable';
  }
}

loadVisitorCount();


const form=document.querySelector('#contact-form');
form?.addEventListener('submit',event=>{event.preventDefault();if(!form.reportValidity())return;const fields=new FormData(form);const name=String(fields.get('name')||'').trim();const email=String(fields.get('email')||'').trim();const service=String(fields.get('service')||'');const message=String(fields.get('message')||'').trim();const subject=encodeURIComponent('AGNEX project enquiry — '+service);const body=encodeURIComponent(`Name: ${name}\nEmail: ${email}\nService: ${service}\n\nProject details:\n${message}`);const status=document.querySelector('#form-status');status.textContent='Your email application will open. Review and send the message there; the website has not sent it.';window.location.href=`mailto:hello@agnexdigital.com?subject=${subject}&body=${body}`;});
