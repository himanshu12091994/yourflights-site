// ─────────────────────────────────────────────────────────────
// Verified Client Testimonials Section
// ─────────────────────────────────────────────────────────────
import React from 'react';
import { Star } from 'lucide-react';
import { translations } from '../../translations';

interface TestimonialsSectionProps {
  t: typeof translations['en'];
}

export const TestimonialsSection: React.FC<TestimonialsSectionProps> = ({
  t,
}) => {
  const testimonials = [
    {
      name: 'Sarah Jenkins',
      role: t.testimonials.t1Role,
      content: t.testimonials.t1Content,
      rating: 5,
    },
    {
      name: 'Michael Chen',
      role: t.testimonials.t2Role,
      content: t.testimonials.t2Content,
      rating: 5,
    },
    {
      name: 'Emma & David',
      role: t.testimonials.t3Role,
      content: t.testimonials.t3Content,
      rating: 5,
    },
  ];

  return (
    <section className="py-20 bg-blue-600 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl font-bold">{t.testimonials.title}</h2>
          <p className="mt-4 text-lg text-blue-100">
            {t.testimonials.subtitle}
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, i) => (
            <div
              key={i}
              className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20"
            >
              <div className="flex space-x-1 mb-6">
                {[...Array(testimonial.rating)].map((_, idx) => (
                  <Star
                    key={idx}
                    className="h-5 w-5 fill-amber-400 text-amber-400"
                  />
                ))}
              </div>
              <p className="text-blue-50 text-lg leading-relaxed mb-8">
                "{testimonial.content}"
              </p>
              <div>
                <p className="font-bold text-white">{testimonial.name}</p>
                <p className="text-blue-200 text-sm">{testimonial.role}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
