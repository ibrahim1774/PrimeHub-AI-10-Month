
import React, { useRef } from 'react';
import { GeneratedSiteData } from '../types';
import IconRenderer from './IconRenderer';
import { CheckCircle, Camera, Sparkles, UserCheck, HelpCircle } from 'lucide-react';

interface SiteRendererProps {
  data: GeneratedSiteData;
  isEditMode: boolean;
  onUpdate: (updatedData: GeneratedSiteData) => void;
}

const formatPhoneNumber = (phone: string) => {
  const digits = phone.replace(/\D/g, '');
  if (digits.length === 10) {
    return `${digits.slice(0, 3)}-${digits.slice(3, 6)}-${digits.slice(6)}`;
  }
  return phone;
};

const EditableText: React.FC<{
  text: string;
  className?: string;
  isEditMode: boolean;
  onBlur: (val: string) => void;
  as?: React.ElementType;
  style?: React.CSSProperties;
}> = ({ text, className, isEditMode, onBlur, as: Tag = 'div', style }) => {
  const handleBlur = (e: React.FocusEvent<HTMLElement>) => {
    onBlur(e.currentTarget.innerText);
  };

  return (
    <Tag
      contentEditable={isEditMode}
      suppressContentEditableWarning
      className={`${className} ${isEditMode ? 'hover:ring-2 hover:ring-blue-400/30 transition-all outline-none focus:ring-2 focus:ring-blue-500/50 rounded-sm' : ''} font-light`}
      onBlur={handleBlur}
      style={style}
    >
      {text}
    </Tag>
  );
};

const EditableImage: React.FC<{
  src: string;
  alt: string;
  className: string;
  isEditMode: boolean;
  onUpload: (base64: string) => void;
}> = ({ src, alt, className, isEditMode, onUpload }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onUpload(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className={`relative group cursor-pointer ${className}`} onClick={() => isEditMode && fileInputRef.current?.click()}>
      <img src={src} alt={alt} className="w-full h-full object-cover" />
      {isEditMode && (
        <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center p-4">
          <div className="bg-white/95 px-4 py-2 rounded-full shadow-2xl flex items-center gap-2 transform group-hover:scale-105 transition-transform">
            <Camera className="text-blue-600 w-5 h-5" />
            <span className="text-blue-900 font-bold text-xs uppercase tracking-tight">📷 Replace image</span>
          </div>
          <input 
            type="file" 
            ref={fileInputRef} 
            className="hidden" 
            accept="image/*" 
            onChange={handleFileChange} 
          />
        </div>
      )}
    </div>
  );
};

const SiteRenderer: React.FC<SiteRendererProps> = ({ data, isEditMode, onUpdate }) => {
  const primaryColor = '#2563eb';

  const updateField = (path: string, val: any) => {
    const newData = JSON.parse(JSON.stringify(data));
    const keys = path.split('.');
    let current = newData;
    for (let i = 0; i < keys.length - 1; i++) {
      current = current[keys[i]];
    }
    current[keys[keys.length - 1]] = val;
    onUpdate(newData);
  };

  return (
    <div className="min-h-screen bg-white text-gray-900 selection:bg-blue-100 font-light" style={{ fontFamily: '"Avenir Light", Avenir, sans-serif' }}>
      {/* Dynamic Nav - Adjusted to show CTA clearly on mobile */}
      <nav className="sticky top-0 left-0 right-0 z-[90] bg-white/95 backdrop-blur-md border-b border-gray-100 py-4 px-4 md:px-12 flex justify-between items-center transition-all">
        <div className="flex-1 min-w-0 pr-4">
          <EditableText
            text={data.contact.companyName.toUpperCase()}
            isEditMode={isEditMode}
            onBlur={(val) => updateField('contact.companyName', val)}
            className="font-bold text-base md:text-xl tracking-tighter truncate"
          />
        </div>
        <a 
          href={`tel:${data.contact.phone}`}
          className="bg-blue-600 text-white px-4 md:px-8 py-3 rounded-xl font-bold text-[11px] md:text-sm transition-all hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-blue-500/10 uppercase tracking-tighter flex-shrink-0"
          style={{ backgroundColor: primaryColor }}
        >
          <div className="flex flex-col md:flex-row items-center justify-center md:gap-1.5 leading-tight text-center">
            <span>Get an estimate</span>
            <span className="text-[10px] md:text-sm md:before:content-[':'] opacity-95">{formatPhoneNumber(data.contact.phone)}</span>
          </div>
        </a>
      </nav>

      {/* Hero Section - Increased Padding for less density */}
      <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden py-24 md:py-36">
        <div className="absolute inset-0 z-0">
          <EditableImage
            src={data.hero.heroImage}
            alt="Hero Background"
            className="w-full h-full"
            isEditMode={isEditMode}
            onUpload={(base64) => updateField('hero.heroImage', base64)}
          />
          <div className="absolute inset-0 bg-black/70 md:bg-black/60"></div>
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-6 text-center">
          <div className="inline-flex items-center gap-2 mb-10 px-5 py-2.5 rounded-full bg-blue-600/20 backdrop-blur-md border border-blue-400/30 text-blue-100 text-[10px] md:text-[11px] font-bold tracking-[0.2em] uppercase">
            <Sparkles size={14} className="text-blue-400" />
            <EditableText
              text={data.hero.badge || `Trusted in ${data.contact.location}`}
              isEditMode={isEditMode}
              onBlur={(val) => updateField('hero.badge', val)}
            />
          </div>
          <h1 className="text-white text-3xl md:text-[72px] font-bold tracking-tighter leading-[0.95] mb-12 max-w-5xl mx-auto">
            <EditableText 
              text={data.hero.headline.line1} 
              isEditMode={isEditMode} 
              onBlur={(val) => updateField('hero.headline.line1', val)} 
              className="block opacity-90"
            />
            <EditableText 
              text={data.hero.headline.line2} 
              isEditMode={isEditMode} 
              onBlur={(val) => updateField('hero.headline.line2', val)} 
              className="block my-3"
              style={{ color: primaryColor }}
            />
            <EditableText 
              text={data.hero.headline.line3} 
              isEditMode={isEditMode} 
              onBlur={(val) => updateField('hero.headline.line3', val)} 
              className="block opacity-80"
            />
          </h1>
          <EditableText
            text={data.hero.subtext}
            isEditMode={isEditMode}
            onBlur={(val) => updateField('hero.subtext', val)}
            className="max-w-2xl mx-auto text-gray-300 text-sm md:text-lg font-light leading-relaxed mb-16"
          />
          
          <div className="flex flex-col items-center gap-10">
            <a 
              href={`tel:${data.contact.phone}`}
              className="w-full sm:w-auto px-12 md:px-20 py-7 bg-white text-blue-900 font-bold rounded-2xl shadow-2xl transition-all hover:scale-[1.02] active:scale-[0.98] uppercase tracking-tighter text-sm md:text-3xl whitespace-nowrap overflow-hidden inline-flex items-center justify-center gap-2"
            >
              Get An Estimate: {formatPhoneNumber(data.contact.phone)}
            </a>
            
            <div className="flex flex-wrap justify-center gap-x-10 gap-y-6 text-white/70 font-bold text-[10px] md:text-[12px] uppercase tracking-widest max-w-5xl mx-auto">
              {['Professional Service Range', 'Quality Workmanship', 'Dedicated Support', 'Locally Owned & Operated', 'Honest Pricing', 'Reliable Solutions', 'Prompt Arrival'].map((item, idx) => (
                <div key={idx} className="flex items-center gap-2.5">
                  <CheckCircle size={16} className="text-blue-400" /> {item}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Services Section - Increased Padding & Gap */}
      <section className="py-20 md:py-32 px-6 md:px-12 bg-gray-50 border-y border-gray-100">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-20 gap-8">
            <div className="max-w-2xl">
              <div className="text-blue-600 font-bold text-[11px] uppercase tracking-[0.2em] mb-5">Our Expertise</div>
              <EditableText
                text="Comprehensive Services Offered"
                isEditMode={isEditMode}
                onBlur={() => {}}
                className="text-4xl md:text-5xl font-bold tracking-tighter text-gray-900"
                as="h2"
              />
            </div>
            <p className="text-gray-500 font-medium max-w-sm md:text-right text-sm md:text-base border-l md:border-l-0 md:border-r border-blue-200 pl-8 md:pl-0 md:pr-8">
              Providing reliable {data.contact.companyName} solutions across {data.contact.location}.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
            {data.services.cards.map((service, idx) => (
              <div key={idx} className="group bg-white p-12 rounded-[2.5rem] shadow-sm border border-gray-100 hover:border-blue-200 hover:shadow-lg transition-all flex flex-col items-start h-full">
                <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-10 transition-transform group-hover:scale-110" style={{ backgroundColor: `${primaryColor}10`, color: primaryColor }}>
                  <IconRenderer name={service.icon} className="w-8 h-8" />
                </div>
                <EditableText
                  text={service.title}
                  isEditMode={isEditMode}
                  onBlur={(val) => {
                    const cards = [...data.services.cards];
                    cards[idx].title = val;
                    updateField('services.cards', cards);
                  }}
                  className="text-2xl font-bold mb-5 tracking-tight text-gray-900"
                  as="h3"
                />
                <EditableText
                  text={service.description}
                  isEditMode={isEditMode}
                  onBlur={(val) => {
                    const cards = [...data.services.cards];
                    cards[idx].description = val;
                    updateField('services.cards', cards);
                  }}
                  className="text-gray-500 text-sm md:text-base font-light leading-relaxed flex-grow"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section - Increased Spacing */}
      <section className="py-20 md:py-32 px-6 md:px-12 bg-white">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-20">
          <div className="lg:w-1/2 order-2 lg:order-1">
            <EditableImage
              src={data.repairBenefits.image}
              alt="Professional Repair Work"
              className="rounded-[3rem] shadow-2xl w-full aspect-[4/3]"
              isEditMode={isEditMode}
              onUpload={(base64) => updateField('repairBenefits.image', base64)}
            />
          </div>
          <div className="lg:w-1/2 order-1 lg:order-2 space-y-16">
            <div>
              <div className="text-blue-600 font-bold text-[11px] uppercase tracking-[0.2em] mb-5">Service Advantages</div>
              <EditableText
                text={data.repairBenefits.title || "The Benefits of Professional Repair"}
                isEditMode={isEditMode}
                onBlur={(val) => updateField('repairBenefits.title', val)}
                className="text-4xl md:text-5xl font-bold tracking-tighter text-gray-900 leading-tight"
                as="h2"
              />
            </div>
            <div className="space-y-12">
              {data.repairBenefits.items?.map((item, idx) => (
                <div key={idx} className="flex gap-8 items-start">
                  <div className="shrink-0 w-14 h-14 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
                    <IconRenderer name={item.icon || 'shield-check'} className="w-7 h-7" />
                  </div>
                  <div className="space-y-3">
                    <EditableText
                      text={item.title}
                      isEditMode={isEditMode}
                      onBlur={(val) => {
                        const items = [...data.repairBenefits.items];
                        items[idx].title = val;
                        updateField('repairBenefits.items', items);
                      }}
                      className="text-xl font-bold text-gray-900"
                      as="h4"
                    />
                    <EditableText
                      text={item.description}
                      isEditMode={isEditMode}
                      onBlur={(val) => {
                        const items = [...data.repairBenefits.items];
                        items[idx].description = val;
                        updateField('repairBenefits.items', items);
                      }}
                      className="text-sm md:text-base text-gray-500 font-light leading-relaxed"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* About Section - Increased Spacing */}
      <section className="py-20 md:py-32 px-6 md:px-12 bg-gray-50">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-24 items-center">
          <div className="space-y-10">
            <div className="flex items-center gap-3 text-blue-600 font-bold text-[10px] md:text-[11px] uppercase tracking-widest">
              <UserCheck size={14} /> Local Commitment
            </div>
            <EditableText
              text={data.aboutUs.title}
              isEditMode={isEditMode}
              onBlur={(val) => updateField('aboutUs.title', val)}
              className="text-3xl md:text-5xl font-bold tracking-tighter leading-tight"
              as="h2"
            />
            <EditableText
              text={data.aboutUs.content}
              isEditMode={isEditMode}
              onBlur={(val) => updateField('aboutUs.content', val)}
              className="text-gray-600 text-sm md:text-lg font-light leading-relaxed"
            />
            <div className="pt-6">
              <a 
                href={`tel:${data.contact.phone}`}
                className="inline-block px-12 py-6 bg-gray-900 text-white font-bold rounded-2xl shadow-xl hover:bg-black transition-colors uppercase text-[12px] tracking-tighter"
              >
                Get an estimate
              </a>
            </div>
          </div>
          <div className="relative">
            <EditableImage
              src={data.aboutUs.image}
              alt="About Us"
              className="rounded-[2.5rem] shadow-2xl aspect-video md:aspect-[4/3]"
              isEditMode={isEditMode}
              onUpload={(base64) => updateField('aboutUs.image', base64)}
            />
          </div>
        </div>
      </section>

      {/* FAQ Section - Increased Vertical Air */}
      <section className="py-20 md:py-32 px-6 md:px-12 bg-gray-50">
        <div className="max-w-5xl mx-auto">
          <div className="space-y-6 mb-20">
            <div className="flex items-center gap-3 text-blue-600 font-bold text-[11px] uppercase tracking-widest">
              <HelpCircle size={18} /> Common Questions
            </div>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tighter">Service FAQ</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-24 gap-y-16">
            {data.faqs.map((faq, idx) => (
              <div key={idx} className="space-y-5">
                <EditableText
                  text={faq.question}
                  isEditMode={isEditMode}
                  onBlur={(val) => {
                    const faqs = [...data.faqs];
                    faqs[idx].question = val;
                    updateField('faqs', faqs);
                  }}
                  className="text-xl font-bold tracking-tight text-gray-900 border-l-3 border-blue-500 pl-6"
                  as="h4"
                />
                <EditableText
                  text={faq.answer}
                  isEditMode={isEditMode}
                  onBlur={(val) => {
                    const faqs = [...data.faqs];
                    faqs[idx].answer = val;
                    updateField('faqs', faqs);
                  }}
                  className="text-sm md:text-lg font-light text-gray-500 leading-relaxed pl-6"
                />
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default SiteRenderer;
