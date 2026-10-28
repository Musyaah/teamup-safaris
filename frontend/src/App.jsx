import { useEffect, useState } from "react";
import {
  Routes,
  Route,
  NavLink,
  Link,
  useLocation,
} from "react-router-dom";
import {
  Menu, X, ArrowRight, ArrowUpRight, MapPin, Phone, Mail,
  Clock, ShieldCheck, Compass, CarFront, Plane, Mountain,
  Trees, Waves, Send, CheckCircle2, MessageCircle,
} from "lucide-react";
import "./App.css";
import { initAnalytics, trackEvent } from "./analytics";
import { usePageMeta } from "./seo";

const BUSINESS = {
  phone: "0702049587",
  whatsapp: "254702049587",
  email: "safaristeamup@gmail.com",
  location: "Karen, Nairobi, Kenya",
};

/* The message that appears ready-typed when someone taps a WhatsApp button.
   They only need to press send. Edit the wording here. */
const DEFAULT_WHATSAPP_MESSAGE = [
  "Karibu! Hello Teamup Safaris 👋",
  "",
  "I'd like to plan a trip and get a quote. Can you help me?",
  "",
  "Service: ___",
  "Destination or pickup location: ___",
  "Date: ___",
  "Number of travellers: ___",
].join("\n");

function whatsappUrl(message = DEFAULT_WHATSAPP_MESSAGE) {
  return `https://wa.me/${BUSINESS.whatsapp}?text=${encodeURIComponent(message)}`;
}
/* Backend address. Locally it falls back to your own computer.
   On Netlify, set VITE_API_URL (see .env.example) to your live backend link. */
const API_URL =
  import.meta.env.VITE_API_URL || "http://127.0.0.1:8000/api/bookings/";

/* ------------------------------------------------------------------
   YOUR OWN PHOTOS
   Put these files in  public/images/  (see the folder I gave you).
   Anything in /public is served from the site root, e.g. /images/demio.jpg
------------------------------------------------------------------- */
const MY_PHOTOS = {
  demio: "/images/demio.jpg",
  esquire: "/images/esquire.jpg",
  bothCars: "/images/both-cars.jpg",
  tours: "/images/tours-and-excursions.jpg",
  customPlanning: "/images/custom-travel-planning.jpg",
  safariLodge: "/images/safari-lodges.jpg",
  beachResort: "/images/beach-resorts.jpg",
};

const destinations = [
  {
    name: "Maasai Mara",
    region: "Narok County",
    type: "Wildlife Safari",
    image: "https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&w=1100&q=85",
    description: "Home of the Great Wildebeest Migration, big cats and Maasai culture on the open savannah.",
  },
  {
    name: "Amboseli",
    region: "Kajiado County",
    type: "Elephants & Kilimanjaro",
    image: "https://images.unsplash.com/photo-1534177616072-ef7dc120449d?auto=format&fit=crop&w=1100&q=85",
    description: "Famous for big elephant herds with Mount Kilimanjaro rising behind them.",
  },
  {
    name: "Tsavo",
    region: "Taita-Taveta & Makueni",
    type: "Adventure Safari",
    image: "https://images.unsplash.com/photo-1549366021-9f761d450615?auto=format&fit=crop&w=1100&q=85",
    description: "Kenya's largest park, known for its red-dust elephants and vast wilderness.",
  },
  {
    name: "Lake Nakuru",
    region: "Nakuru County",
    type: "Nature Escape",
    image: "https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?auto=format&fit=crop&w=1100&q=85",
    description: "A Rift Valley lake with birdlife, rhinos and sweeping views from Baboon Cliff.",
  },
  {
    name: "Mount Kenya",
    region: "Central Kenya",
    type: "Mountain Adventure",
    image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1100&q=85",
    description: "Africa's second-highest peak, with highland forests, moorland and cool mountain air.",
  },
  {
    name: "Nairobi National Park",
    region: "Nairobi",
    type: "Day Safari",
    image: "https://images.unsplash.com/photo-1535338454770-8be927b5a00b?auto=format&fit=crop&w=1100&q=85",
    description: "Wildlife with the city skyline in the background, just minutes from the capital.",
  },
  {
    name: "Diani Beach",
    region: "Kwale County",
    type: "Coastal Getaway",
    image: "https://images.unsplash.com/photo-1510414842594-a61c69b5ae57?auto=format&fit=crop&w=1100&q=85",
    description: "Palm-lined white sands and warm Indian Ocean waters on Kenya's south coast.",
  },
  {
    name: "Samburu",
    region: "Samburu County",
    type: "Wildlife & Culture",
    image: "/images/destinations/samburu.jpg",
    description: "Dry northern landscapes, the Ewaso Nyiro river and the Samburu Special Five.",
  },
  {
    name: "Hell's Gate",
    region: "Naivasha",
    type: "Outdoor Adventure",
    image: "https://images.unsplash.com/photo-1472396961693-142e6e269027?auto=format&fit=crop&w=1100&q=85",
    description: "Cycle or walk among cliffs, gorges and wildlife in dramatic Rift Valley scenery.",
  },
  {
    name: "Lake Naivasha",
    region: "Nakuru County",
    type: "Lake & Boat Rides",
    image: "/images/destinations/lake-naivasha.jpg",
    description: "Freshwater lake with hippos, birdlife, boat rides and nearby Crescent Island.",
  },
  {
    name: "Lamu Old Town",
    region: "Lamu County",
    type: "Swahili Heritage",
    image: "/images/destinations/lamu-old-town.jpg",
    description: "A UNESCO World Heritage town of narrow lanes, dhows and centuries of Swahili culture.",
  },
  {
    name: "Ol Pejeta Conservancy",
    region: "Laikipia County",
    type: "Conservation Safari",
    image: "/images/destinations/ol-pejeta.jpg",
    description: "See rhinos, including the northern white rhino, with Mount Kenya on the horizon.",
  },
  {
    name: "Fort Jesus, Mombasa",
    region: "Mombasa County",
    type: "History & Culture",
    image: "/images/destinations/fort-jesus.jpg",
    description: "A 16th-century Portuguese fort and Mombasa's Old Town, full of coastal history.",
  },
  {
    name: "Aberdare National Park",
    region: "Nyeri & Nyandarua",
    type: "Highlands & Waterfalls",
    image: "/images/destinations/aberdare.jpg",
    description: "Misty moorland, forests, waterfalls and wildlife in the central highlands.",
  },
  {
    name: "Watamu",
    region: "Kilifi County",
    type: "Marine Park & Beach",
    image: "/images/destinations/watamu.jpg",
    description: "Turquoise lagoons, coral reefs and turtle conservation on the north coast.",
  },
];

const services = [
  {
    icon: Plane,
    slug: "airport-transfer",
    title: "Airport Transfers",
    description: "Arrange airport pickups and drop-offs around your travel schedule.",
    image: MY_PHOTOS.esquire,
    position: "center 55%",
  },
  {
    icon: CarFront,
    slug: "hotel-transfer",
    title: "Hotel Transfers",
    description: "Plan transport between your accommodation and destinations.",
    image: MY_PHOTOS.demio,
    position: "center 60%",
  },
  {
    icon: Trees,
    slug: "game-drive",
    title: "Game Drives & Safaris",
    description: "Explore Kenya's national parks and wildlife destinations.",
    image: "https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&w=900&q=85",
  },
  {
    icon: ShieldCheck,
    slug: "personal-chauffeur",
    title: "Personal Chauffeur",
    description: "Arrange private transport for business, events and sightseeing.",
    image: MY_PHOTOS.bothCars,
    position: "center 60%",
  },
  {
    icon: Compass,
    slug: "tours-excursions",
    title: "Tours & Excursions",
    description: "Discuss day trips and tours that match your interests.",
    image: MY_PHOTOS.tours,
  },
  {
    icon: Mountain,
    slug: "custom-travel-planning",
    title: "Custom Travel Planning",
    description: "Build an itinerary around your preferred places and dates.",
    image: MY_PHOTOS.customPlanning,
  },
];

const stays = [
  {
    title: "Safari Lodges",
    description: "Explore accommodation options near wildlife reserves and parks.",
    image: MY_PHOTOS.safariLodge,
    icon: Trees,
  },
  {
    title: "Hotels",
    description: "Consider city or countryside stays for your itinerary.",
    image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1000&q=85",
    icon: ShieldCheck,
  },
  {
    title: "Beach Resorts",
    description: "Explore coastal accommodation for a relaxing getaway.",
    image: MY_PHOTOS.beachResort,
    icon: Waves,
  },
  {
    title: "Nature Retreats",
    description: "Look into peaceful stays surrounded by natural scenery.",
    image: "https://images.unsplash.com/photo-1449158743715-0a90ebb6d2d8?auto=format&fit=crop&w=1000&q=85",
    icon: Mountain,
  },
];

/* Shows a green placeholder instead of a broken image if a photo is missing */
function SafeImage({ src, alt, className, style }) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <div className={`${className || ""} image-fallback`} role="img" aria-label={alt}>
        <Compass size={30} />
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      className={className}
      style={style}
      loading="lazy"
      onError={() => setFailed(true)}
    />
  );
}

function WhatsAppButton({ children = "Chat on WhatsApp", message }) {
  return (
    <a className="button button-whatsapp" href={whatsappUrl(message)} target="_blank" rel="noreferrer" onClick={() => trackEvent("whatsapp_click", { placement: "button" })}>
      <MessageCircle size={18} /> {children}
    </a>
  );
}

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const links = [
    ["Home", "/"],
    ["Services", "/services"],
    ["Destinations", "/destinations"],
    ["About Us", "/about"],
    ["Hotels & Stays", "/hotels"],
    ["Contact", "/contact"],
  ];

  return (
    <header className="site-header">
      <div className="top-strip">
        <div className="container top-strip-inner">
          <span><MapPin size={14} /> {BUSINESS.location}</span>
          <a href={`tel:${BUSINESS.phone}`}><Phone size={14} /> {BUSINESS.phone}</a>
        </div>
      </div>

      <nav className="navbar container">
        <Link to="/" className="brand" onClick={() => setMenuOpen(false)}>
          <span className="brand-mark"><Compass size={27} /></span>
          <span className="brand-copy"><strong>TEAMUP</strong><span>SAFARIS</span></span>
        </Link>

        <button
          className="menu-toggle"
          type="button"
          aria-label="Toggle navigation"
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <X size={25} /> : <Menu size={25} />}
        </button>

        <div className={`nav-links ${menuOpen ? "nav-links-open" : ""}`}>
          {links.map(([label, to]) => (
            <NavLink
              key={to}
              to={to}
              end={to === "/"}
              onClick={() => setMenuOpen(false)}
              className={({ isActive }) => `nav-link ${isActive ? "nav-link-active" : ""}`}
            >
              {label}
            </NavLink>
          ))}
          <Link to="/contact" className="button button-primary nav-cta" onClick={() => setMenuOpen(false)}>
            Plan Your Trip <ArrowUpRight size={17} />
          </Link>
        </div>
      </nav>
    </header>
  );
}

function SectionHeading({ eyebrow, title, description, centered = false }) {
  return (
    <div className={`section-heading ${centered ? "text-center" : ""}`}>
      <span className="eyebrow">{eyebrow}</span>
      <h2>{title}</h2>
      {description && <p>{description}</p>}
    </div>
  );
}

function PageBanner({ eyebrow, title, description, image }) {
  return (
    <section className="page-banner" style={{ backgroundImage: `url("${image}")` }}>
      <div className="page-banner-shade" />
      <div className="container page-banner-content">
        <span className="eyebrow eyebrow-light">{eyebrow}</span>
        <h1>{title}</h1>
        <p>{description}</p>
        <div className="breadcrumbs"><Link to="/">Home</Link><span>/</span><span>{title}</span></div>
      </div>
    </section>
  );
}

function ServiceCard({ service, index }) {
  const Icon = service.icon;
  return (
    <article className="service-card">
      <div className="service-photo">
        <SafeImage
          src={service.image}
          alt={service.title}
          className="service-image"
          style={service.position ? { objectPosition: service.position } : undefined}
        />
        <span className="service-number">{String(index + 1).padStart(2, "0")}</span>
        <span className="service-icon"><Icon size={25} /></span>
      </div>
      <div className="service-card-body">
        <h3>{service.title}</h3>
        <p>{service.description}</p>
        <Link
          to="/contact"
          state={{ service: service.slug }}
          className="text-link"
        >
          Make an enquiry <ArrowRight size={16} />
        </Link>
      </div>
    </article>
  );
}

function DestinationCard({ destination, index }) {
  return (
    <article className="destination-card">
      <Link to="/contact" state={{ destination: destination.name }} className="destination-image-link" aria-label={`Enquire about ${destination.name}`}>
        <SafeImage src={destination.image} alt={`${destination.name}, Kenya`} className="destination-image" />
        <span className="destination-number">{String(index + 1).padStart(2, "0")}</span>
        <span className="destination-arrow"><ArrowUpRight size={20} /></span>
      </Link>
      <div className="destination-content">
        <span className="destination-type">{destination.type}</span>
        <h3><Link to="/contact" state={{ destination: destination.name }}>{destination.name}</Link></h3>
        <span className="destination-region"><MapPin size={14} /> {destination.region}</span>
        <p>{destination.description}</p>
        <Link to="/contact" state={{ destination: destination.name }} className="text-link">Plan this trip <ArrowRight size={16} /></Link>
      </div>
    </article>
  );
}

function Home() {
  return (
    <>
      <section className="hero">
        <div className="hero-background" />
        <div className="hero-overlay" />
        <div className="container hero-content">
          <span className="eyebrow eyebrow-light">YOUR JOURNEY. OUR PASSION.</span>
          <h1>Discover the wild.<br /><span>Experience the extraordinary.</span></h1>
          <p>From airport transfers to unforgettable Kenyan safaris, let us help you make every journey count.</p>
          <div className="hero-actions">
            <Link to="/destinations" className="button button-gold">Explore Destinations <ArrowRight size={18} /></Link>
            <Link to="/services" className="button button-outline-light">Discover Our Services</Link>
          </div>
          <div className="hero-note">
            <span className="hero-note-icon"><MapPin size={17} /></span>
            <span><strong>Rooted in Kenya</strong><small>Ready for your next adventure</small></span>
          </div>
        </div>
        <div className="hero-side-label">KENYA · EAST AFRICA</div>
      </section>

      <section className="intro-strip">
        <div className="container intro-grid">
          <div className="intro-lead"><span className="eyebrow">KARIBU TEAMUP</span><h2>Travel made meaningful.</h2></div>
          <p>Whether you're heading to the airport, exploring a national park or planning a getaway, we're here to help you arrange a journey that suits your plans.</p>
          <Link to="/about" className="text-link intro-link">Get to know us <ArrowRight size={17} /></Link>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <SectionHeading eyebrow="WHAT WE DO" title="Your journey, thoughtfully planned." description="Transport and travel experiences designed around where you want to go." />
          <div className="services-grid">
            {services.slice(0, 4).map((service, index) => <ServiceCard key={service.title} service={service} index={index} />)}
          </div>
          <div className="section-bottom-link"><Link to="/services" className="button button-outline-dark">Explore All Services <ArrowRight size={17} /></Link></div>
        </div>
      </section>

      <section className="section section-destinations">
        <div className="container">
          <div className="section-heading-row">
            <SectionHeading eyebrow="EXPLORE KENYA" title="Places worth the journey." description="From open savannahs to Swahili coastlines, discover a destination for your next adventure." />
            <Link to="/destinations" className="text-link desktop-heading-link">All destinations <ArrowRight size={17} /></Link>
          </div>
          <div className="destinations-grid">
            {destinations.slice(0, 3).map((destination, index) => <DestinationCard key={destination.name} destination={destination} index={index} />)}
          </div>
          <div className="mobile-section-link"><Link to="/destinations" className="button button-outline-dark">View All Destinations <ArrowRight size={17} /></Link></div>
        </div>
      </section>

      <section className="experience-section">
        <div className="experience-image" />
        <div className="experience-content">
          <span className="eyebrow eyebrow-light">THE TEAMUP EXPERIENCE</span>
          <h2>More than getting there. It's how you experience the journey.</h2>
          <p>We help bring your travel plans together, with personal communication and arrangements tailored to your needs.</p>
          <Link to="/contact" className="button button-gold">Let's Plan Your Journey <ArrowRight size={18} /></Link>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <SectionHeading eyebrow="WHY TRAVEL WITH US" title="A considered approach to every trip." description="Good journeys begin with clear communication and a plan that works for you." centered />
          <div className="benefits-grid">
            <div className="benefit"><span className="benefit-icon"><ShieldCheck /></span><h3>Personal Attention</h3><p>Discuss your needs directly with our team.</p></div>
            <div className="benefit"><span className="benefit-icon"><Compass /></span><h3>Flexible Planning</h3><p>Explore options that suit your itinerary.</p></div>
            <div className="benefit"><span className="benefit-icon"><CarFront /></span><h3>Transport Options</h3><p>Ask about a suitable vehicle for your trip.</p></div>
            <div className="benefit"><span className="benefit-icon"><MessageCircle /></span><h3>Clear Communication</h3><p>Contact us to discuss plans before confirming.</p></div>
          </div>
        </div>
      </section>
      <CallToAction />
    </>
  );
}

function Services() {
  return (
    <>
      <PageBanner eyebrow="TRAVEL YOUR WAY" title="Our Services" description="Transport and travel arrangements for your next Kenyan adventure." image="https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&w=2000&q=85" />
      <section className="section"><div className="container">
        <SectionHeading eyebrow="HOW WE CAN HELP" title="One team. Different ways to explore." description="Tell us what you have in mind and we'll discuss the arrangements." centered />
        <div className="services-grid services-grid-full">{services.map((service, index) => <ServiceCard key={service.title} service={service} index={index} />)}</div>
      </div></section>
      <CallToAction />
    </>
  );
}

function Destinations() {
  return (
    <>
      <PageBanner eyebrow="THE BEAUTY OF KENYA" title="Explore Destinations" description="Find inspiration for a wildlife safari, outdoor adventure, cultural visit or coastal escape." image="https://images.unsplash.com/photo-1534177616072-ef7dc120449d?auto=format&fit=crop&w=2000&q=85" />
      <section className="section"><div className="container">
        <SectionHeading eyebrow="WHERE WILL YOU GO?" title="Your next story starts here." description="Explore destinations and contact us to discuss your itinerary." />
        <div className="destinations-grid destinations-grid-full">{destinations.map((destination, index) => <DestinationCard key={destination.name} destination={destination} index={index} />)}</div>
      </div></section>
      <CallToAction />
    </>
  );
}

function About() {
  return (
    <>
      <PageBanner eyebrow="OUR STORY" title="About Teamup" description="A Kenya-based travel and transport service helping you plan the journey ahead." image="https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?auto=format&fit=crop&w=2000&q=85" />
      <section className="section"><div className="container about-grid">
        <div className="about-image-wrap">
          <SafeImage className="about-image" src={MY_PHOTOS.bothCars} alt="Teamup Safaris vehicles" />
          <div className="about-image-caption"><Compass size={22} /><span>Discover Kenya with Teamup</span></div>
        </div>
        <div className="about-copy">
          <span className="eyebrow">TEAMUP SAFARIS</span>
          <h2>Every great adventure begins with a plan.</h2>
          <p>We help travellers arrange transport, explore destinations and plan memorable experiences across Kenya. Whether you need an airport transfer or want to discuss a safari, our team is ready to hear what you have in mind.</p>
          <p>Based in Karen, Nairobi, we aim to make organising your journey straightforward, personal and suited to your travel needs.</p>
          <div className="about-facts">
            <div><MapPin size={19} /><span><strong>Based in</strong>Karen, Nairobi</span></div>
            <div><CarFront size={19} /><span><strong>Travel options</strong>Private transport & tours</span></div>
          </div>
          <Link to="/contact" className="button button-primary">Talk to Our Team <ArrowRight size={17} /></Link>
        </div>
      </div></section>

      <section className="section section-vehicles"><div className="container">
        <SectionHeading eyebrow="OUR VEHICLES" title="Transport for your plans." description="Contact us to confirm vehicle suitability and availability for your requested date." centered />
        <div className="vehicle-grid">
          <article className="vehicle-card"><SafeImage src={MY_PHOTOS.demio} alt="Red Mazda Demio" /><div className="vehicle-info"><span className="eyebrow">VEHICLE 01</span><h3>Mazda Demio</h3><p>Registration: KDS 081D</p><span className="vehicle-note">Availability confirmed on enquiry</span></div></article>
          <article className="vehicle-card"><SafeImage src={MY_PHOTOS.esquire} alt="Black Toyota Esquire" /><div className="vehicle-info"><span className="eyebrow">VEHICLE 02</span><h3>Toyota Esquire</h3><p>Registration: KDU 523C</p><span className="vehicle-note">Availability confirmed on enquiry</span></div></article>
        </div>
      </div></section>
      <CallToAction />
    </>
  );
}

function Hotels() {
  return (
    <>
      <PageBanner eyebrow="REST, RELAX, EXPLORE" title="Hotels & Stays" description="Get inspiration for where to stay while discovering Kenya." image="https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=2000&q=85" />
      <section className="section"><div className="container">
        <SectionHeading eyebrow="FIND YOUR STAY" title="A place to pause between adventures." description="Explore accommodation styles and contact us to discuss options for your itinerary." centered />
        <div className="stay-grid">{stays.map((stay) => {
          const Icon = stay.icon;
          return <article className="stay-card" key={stay.title}>
            <div className="stay-image-wrap"><SafeImage src={stay.image} alt={stay.title} /><span className="stay-icon"><Icon size={23} /></span></div>
            <div className="stay-content"><h3>{stay.title}</h3><p>{stay.description}</p><Link to="/contact" state={{ service: "accommodation", note: `Interested in: ${stay.title}` }} className="text-link">Enquire about stays <ArrowRight size={16} /></Link></div>
          </article>;
        })}</div>
        <p className="disclaimer">Images are for inspiration. Hotel partnerships, room availability and prices are not confirmed on this page. Please enquire about your travel dates.</p>
      </div></section>
      <CallToAction />
    </>
  );
}

const FIELD_LABELS = {
  name: "Name",
  email: "Email",
  phone: "Phone",
  service: "Service",
  pickup_location: "Pickup location",
  destination: "Destination",
  travel_date: "Travel date",
  passengers: "Travellers",
  notes: "Message",
};

function readApiErrors(result) {
  if (!result || typeof result !== "object") return "";
  if (result.detail) return String(result.detail);
  return Object.entries(result)
    .map(([field, messages]) => `${FIELD_LABELS[field] || field}: ${[].concat(messages).join(" ")}`)
    .join(" ");
}

function Contact() {
  const location = useLocation();
  const emptyForm = {
    name: "", email: "", phone: "", service: "", pickup_location: "",
    destination: "", travel_date: "", passengers: "1", notes: "",
  };
  const [form, setForm] = useState({
    ...emptyForm,
    service: location.state?.service || "",
    destination: location.state?.destination || "",
    notes: location.state?.note || "",
  });
  const [status, setStatus] = useState({ type: "idle", message: "" });

  function updateField(event) {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  }

  async function submitBooking(event) {
    event.preventDefault();
    setStatus({ type: "loading", message: "Sending your enquiry..." });

    const payload = {
      name: form.name.trim(),
      email: form.email.trim(),
      phone: form.phone.trim(),
      service: form.service,
      pickup_location: form.pickup_location.trim(),
      destination: form.destination.trim(),
      travel_date: form.travel_date || null,
      passengers: Number(form.passengers),
      notes: form.notes.trim(),
    };

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const responseText = await response.text();
      let result = {};
      try {
        result = responseText ? JSON.parse(responseText) : {};
      } catch {
        result = {};
      }

      if (!response.ok) {
        const detail = readApiErrors(result);
        throw new Error(detail || `The server returned an error (${response.status}).`);
      }

      setStatus({
        type: "success",
        message: "Your enquiry was submitted successfully. Thank you for contacting Teamup Safaris!",
      });
      trackEvent("generate_lead", { service: form.service });
      setForm(emptyForm);
    } catch (error) {
      setStatus({
        type: "error",
        message: `${error instanceof TypeError ? "We couldn't reach the booking server." : error.message || "We couldn't submit your enquiry."} You can also contact us by phone or WhatsApp.`,
      });
    }
  }

  return (
    <>
      <PageBanner eyebrow="LET'S TALK TRAVEL" title="Contact Us" description="Tell us about your plans. We'll help you explore the next steps." image="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=2000&q=85" />
      <section className="section contact-section"><div className="container contact-grid">
        <div className="contact-info">
          <span className="eyebrow">GET IN TOUCH</span>
          <h2>Let's plan something extraordinary.</h2>
          <p>Have a question about transport, a safari or a place you'd like to visit? Reach out using any of the options below.</p>
          <a className="contact-detail" href={`tel:${BUSINESS.phone}`}><span className="contact-detail-icon"><Phone size={20} /></span><span><small>Call us</small><strong>{BUSINESS.phone}</strong></span></a>
          <a className="contact-detail" href={`mailto:${BUSINESS.email}`}><span className="contact-detail-icon"><Mail size={20} /></span><span><small>Email us</small><strong>{BUSINESS.email}</strong></span></a>
          <div className="contact-detail"><span className="contact-detail-icon"><MapPin size={20} /></span><span><small>Our location</small><strong>{BUSINESS.location}</strong></span></div>
          <div className="contact-detail"><span className="contact-detail-icon"><Clock size={20} /></span><span><small>Enquiries</small><strong>Contact us to discuss your schedule</strong></span></div>
          <WhatsAppButton>Message us on WhatsApp</WhatsAppButton>
        </div>

        <div className="booking-panel">
          <span className="eyebrow">TRIP ENQUIRY</span>
          <h2>Tell us about your plans.</h2>
          <p className="booking-intro">Share a few details and our team can follow up with you.</p>

          {status.message && <div className={`form-alert form-alert-${status.type}`} role="status">{status.type === "success" && <CheckCircle2 size={19} />}<span>{status.message}</span></div>}

          <form className="booking-form" onSubmit={submitBooking}>
            <div className="form-row">
              <label>Full name *<input name="name" value={form.name} onChange={updateField} placeholder="Your full name" autoComplete="name" required /></label>
              <label>Email address *<input name="email" type="email" value={form.email} onChange={updateField} placeholder="you@example.com" autoComplete="email" required /></label>
            </div>
            <div className="form-row">
              <label>Phone number *<input name="phone" type="tel" value={form.phone} onChange={updateField} placeholder="Your phone number" autoComplete="tel" required /></label>
              <label>Service *
                <select name="service" value={form.service} onChange={updateField} required>
                  <option value="">Choose a service</option>
                  {services.map((service) => <option key={service.slug} value={service.slug}>{service.title}</option>)}
                  <option value="accommodation">Accommodation Enquiry</option>
                </select>
              </label>
            </div>
            <div className="form-row">
              <label>Pickup location<input name="pickup_location" value={form.pickup_location} onChange={updateField} placeholder="e.g. JKIA or your hotel" /></label>
              <label>Destination<input name="destination" value={form.destination} onChange={updateField} placeholder="e.g. Maasai Mara" /></label>
            </div>
            <div className="form-row">
              <label>Preferred date<input name="travel_date" type="date" value={form.travel_date} onChange={updateField} min={new Date().toLocaleDateString("en-CA")} /></label>
              <label>Number of travellers
                <select name="passengers" value={form.passengers} onChange={updateField}>
                  {Array.from({ length: 20 }, (_, index) => index + 1).map((number) => <option key={number} value={number}>{number} {number === 1 ? "traveller" : "travellers"}</option>)}
                  <option value="21">More than 20 travellers</option>
                </select>
              </label>
            </div>
            <label>Tell us more<textarea name="notes" value={form.notes} onChange={updateField} placeholder="Your plans, flight details or questions..." rows={4} /></label>
            <button type="submit" className="button button-primary form-submit" disabled={status.type === "loading"}>
              {status.type === "loading" ? "Sending..." : "Send Enquiry"} <Send size={17} />
            </button>
            <p className="form-footnote">Prefer to talk now? Call or message us on WhatsApp using the details on this page.</p>
          </form>
        </div>
      </div></section>
    </>
  );
}

function CallToAction() {
  return (
    <section className="cta-section"><div className="container cta-inner">
      <div><span className="eyebrow eyebrow-light">YOUR NEXT ADVENTURE</span><h2>Let's make your next journey epic.</h2><p>Tell us where you want to go. We'll help you plan the next step.</p></div>
      <div className="cta-actions"><Link to="/contact" className="button button-gold">Plan Your Trip <ArrowRight size={18} /></Link><WhatsAppButton>WhatsApp Us</WhatsAppButton></div>
    </div></section>
  );
}

function Footer() {
  return (
    <footer className="site-footer">
      <div className="container footer-main">
        <div className="footer-brand-column">
          <Link to="/" className="brand footer-brand"><span className="brand-mark"><Compass size={27} /></span><span className="brand-copy"><strong>TEAMUP</strong><span>SAFARIS</span></span></Link>
          <p>Discover the wild. Experience the extraordinary. Your next Kenyan journey starts with Teamup.</p>
          <div className="footer-socials"><a href={whatsappUrl()} target="_blank" rel="noreferrer" aria-label="WhatsApp" onClick={() => trackEvent("whatsapp_click", { placement: "footer" })}><MessageCircle size={18} /></a><a href={`mailto:${BUSINESS.email}`} aria-label="Email"><Mail size={18} /></a></div>
        </div>
        <div className="footer-column"><h3>Explore</h3><Link to="/about">About Us</Link><Link to="/services">Our Services</Link><Link to="/destinations">Destinations</Link><Link to="/hotels">Hotels & Stays</Link></div>
        <div className="footer-column"><h3>Popular Places</h3><Link to="/destinations">Maasai Mara</Link><Link to="/destinations">Amboseli</Link><Link to="/destinations">Lamu Old Town</Link><Link to="/destinations">Diani Beach</Link></div>
        <div className="footer-column footer-contact"><h3>Contact</h3><a href={`tel:${BUSINESS.phone}`}><Phone size={15} /> {BUSINESS.phone}</a><a href={`mailto:${BUSINESS.email}`}><Mail size={15} /> {BUSINESS.email}</a><span><MapPin size={15} /> {BUSINESS.location}</span><Link to="/contact" className="footer-contact-link">Make an enquiry <ArrowRight size={15} /></Link></div>
      </div>
      <div className="container footer-bottom"><p>© {new Date().getFullYear()} Teamup Safaris. All rights reserved.</p><p>Discover the wild. Experience the extraordinary.</p></div>
    </footer>
  );
}

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [pathname]);
  return null;
}

function AppLayout() {
  const { pathname } = useLocation();
  usePageMeta(pathname);

  useEffect(() => {
    initAnalytics();
  }, []);

  return (
    <>
      <ScrollToTop />
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/services" element={<Services />} />
          <Route path="/destinations" element={<Destinations />} />
          <Route path="/about" element={<About />} />
          <Route path="/hotels" element={<Hotels />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="*" element={<PageNotFound />} />
        </Routes>
      </main>
      <Footer />
    </>
  );
}

function PageNotFound() {
  return (
    <section className="section not-found">
      <div className="container">
        <span className="eyebrow">PAGE NOT FOUND</span>
        <h1>Looks like this trail ends here.</h1>
        <p>The page you requested could not be found.</p>
        <Link to="/" className="button button-primary">Back to Home <ArrowRight size={17} /></Link>
      </div>
    </section>
  );
}


export default function App() {
  return <AppLayout />;
}
