 'use strict';
const menuButton=document.querySelector('.menu-toggle');
const nav=document.querySelector('#primary-nav');
menuButton?.addEventListener('click',()=>{if(!nav)return;const open=nav.classList.toggle('open');menuButton.setAttribute('aria-expanded',String(open));menuButton.textContent=open?'×':'☰';});
nav?.querySelectorAll('a').forEach(link=>link.addEventListener('click',()=>{nav.classList.remove('open');if(menuButton){menuButton.setAttribute('aria-expanded','false');menuButton.textContent='☰';}}));
const yearElement=document.querySelector('#year');if(yearElement)yearElement.textContent=new Date().getFullYear();
const form=document.querySelector('#contact-form');const status=document.querySelector('#form-status');let isSubmitting=false;
form?.addEventListener('submit',async event=>{event.preventDefault();if(isSubmitting||!form.reportValidity())return;
const button=form.querySelector('[type="submit"]');const originalText=button?.textContent||'Send Enquiry →';isSubmitting=true;
if(button){button.disabled=true;button.textContent='Sending...';}
if(status){status.classList.remove('form-success','form-error');status.textContent='Submitting your enquiry...';}
try{const response=await fetch(form.action,{method:'POST',body:new FormData(form),headers:{Accept:'application/json'}});
if(!response.ok){let message='Submission failed';try{const data=await response.json();if(Array.isArray(data.errors))message=data.errors.map(x=>x.message).filter(Boolean).join('; ')||message;}catch(_){}throw new Error(message);}
if(status){status.classList.remove('form-error');status.classList.add('form-success');status.textContent='✓ Your enquiry has been submitted successfully! Thank you for contacting AGNEX Digital Studio. We will get back to you shortly.';}form.reset();}
catch(error){console.error('AGNEX contact form error:',error);if(status){status.classList.remove('form-success');status.classList.add('form-error');status.textContent='Sorry, your enquiry could not be submitted. Please try again.';}}
finally{isSubmitting=false;if(button){button.disabled=false;button.textContent=originalText;}}});
