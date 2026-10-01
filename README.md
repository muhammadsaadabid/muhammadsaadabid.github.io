# Muhammad Saad — Portfolio

A static portfolio site built with HTML, CSS and vanilla JavaScript. It has no build step, so you can open `index.html` directly or upload the folder to any web host.

## Folder structure

```
/index.html            page markup (hero, about, contact are static)
/css/style.css         all styles; theme colours are CSS variables at the top
/js/data.js            ALL editable content: skills, experience, projects, education, testimonials, links, form keys
/js/main.js            rendering + interactions + animations
/images/               your images (see images/IMAGES-NEEDED.txt)
/assets/resume.pdf     your CV for the "Download CV" buttons
```

## Editing content

Everything that changes often is in **`js/data.js`**. Edit it, save, and refresh the page.

| What | Where in data.js |
|---|---|
| Name, email, phone, WhatsApp, typing roles | `profile` |
| GitHub / LinkedIn URLs | `social` (replace `your-username`) |
| About stats (years, projects, clients…) | `stats`. **Update the Projects and Clients numbers.** |
| "What I do" service cards | `services` |
| Skill cards and scrolling marquee | `skills`, `marquee` |
| Work history | `experience` (**replace the Zeetach bullet points with your own**) |
| Projects + filter buttons | `projects`, `projectFilters` |
| Education | `education` |
| Testimonials | `testimonials`. Set `showTestimonials: false` to hide the section. |
| Contact form provider | `contactForm` |

**Projects:** the six entries are samples. For each one, set `title`, `category` (`fullstack`, `wordpress`, `shopify` or `python`), `description` (card), `details` + `features` (modal), `tech`, `live` and `github`. For `image`, use a **full-page screenshot resized to 800px wide** (JPG, any height); it scrolls on hover. Set `github: ""` to hide the GitHub button. Add `featured: true` to ONE project to show it as a large card on desktop. Links left as `"#"` appear as greyed-out "coming soon" buttons.

**Icons** use Font Awesome 6 class names, e.g. `"fa-brands fa-react"`. Search at <https://fontawesome.com/search?o=r&m=free>.

**Text in index.html:** the hero tagline, About paragraphs and contact cards are plain HTML, so edit them there. If you change your domain, update the `canonical`, `og:url`, `og:image` and `twitter:image` URLs in `<head>`.

**Colours / fonts:** change the variables at the top of `css/style.css` (`:root` for dark, `:root[data-theme="light"]` for light).

## Replacing placeholder images

Save your images with the names in `images/IMAGES-NEEDED.txt`. Until a file exists, a dashed box shows the expected file name and size. You don't need to change any code; the real image replaces the placeholder automatically. Put your CV at `assets/resume.pdf`.

Company logos show initials in a dashed box until the PNG is added.

## Contact form setup

Until the form is set up, submitting it shows a friendly "email me directly" message.

### Option A: Formspree (easiest)
1. Sign up at <https://formspree.io> and create a new form.
2. Copy the endpoint, which looks like `https://formspree.io/f/abcdwxyz`.
3. In `data.js`, set:
   ```js
   contactForm: {
     provider: "formspree",
     formspree: { endpoint: "https://formspree.io/f/abcdwxyz" },
     ...
   }
   ```
4. Send a test message. Formspree asks you to confirm the first submission by email.

### Option B: EmailJS
1. Sign up at <https://www.emailjs.com>. Add an **Email Service** (e.g. Gmail) and note the **Service ID**.
2. Create an **Email Template** using these variables: `{{from_name}}`, `{{from_email}}`, `{{subject}}`, `{{message}}`. Set "Reply To" to `{{reply_to}}`. Note the **Template ID**.
3. Copy your **Public Key** from Account → General.
4. In `data.js`:
   ```js
   contactForm: {
     provider: "emailjs",
     emailjs: { publicKey: "xxxx", serviceId: "service_xxx", templateId: "template_xxx" }
   }
   ```

## Deploying

### cPanel
1. Zip the **contents** of this folder so that `index.html` is at the top level of the zip.
2. cPanel → **File Manager** → open `public_html` (or your subdomain's folder).
3. **Upload** the zip, then right-click → **Extract**. Delete the zip afterwards.
4. Visit your domain. For HTTPS, enable **SSL/TLS Status → AutoSSL** in cPanel.

### Netlify (free)
1. Go to <https://app.netlify.com/drop>.
2. Drag this whole folder onto the page. It goes live instantly on a `*.netlify.app` URL.
3. Optional: Site settings → Domain management → add your own domain.

### GitHub Pages (free)
1. Create a new public repository and upload all the files (or push with git).
2. Repository → **Settings → Pages** → Source: *Deploy from a branch* → Branch `main`, folder `/ (root)` → Save.
3. After a minute the site is live at `https://<username>.github.io/<repo>/`.

## Notes
- Animations use GSAP from a CDN. If it can't load (e.g. offline), the site falls back to built-in CSS/JS animations.
- Visitors with "reduce motion" turned on get a calm version: no blobs, tilt, cursor or typing animation.
- The custom cursor, 3D tilt and magnetic buttons only run on devices with a mouse.
