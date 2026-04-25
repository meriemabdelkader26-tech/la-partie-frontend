import { TESTIMONIALS } from "@/constant";
import { Quote } from "lucide-react";

const HomeTestimonials = () => {
  return (
    <section className="py-32 px-4 bg-white">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-20 animate-fadeInUp">
          <h2 className="text-5xl md:text-6xl font-bold text-black mb-6">
            What Our Users Say
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Trusted by thousands of influencers and brands worldwide
          </p>
        </div>

        {/* Testimonial Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {TESTIMONIALS.map((testimonial, idx) => (
            <div
              key={idx}
              className="group card-modern bg-white hover:shadow-large p-8 relative animate-fadeInUp"
              style={{ animationDelay: `${idx * 100}ms` }}
            >
              {/* Quote Icon */}
              <div className="absolute top-8 right-8 opacity-10 group-hover:opacity-20 transition-opacity">
                <Quote size={48} className="text-black" />
              </div>

              {/* Star Rating */}
              <div className="flex gap-1 mb-6">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className="text-black text-xl">
                    ★
                  </span>
                ))}
              </div>

              {/* Testimonial Content */}
              <p className="text-gray-700 mb-6 leading-relaxed text-lg relative z-10">
                "{testimonial.content}"
              </p>

              {/* User Info */}
              <div className="flex items-center gap-4 pt-6 border-t border-black/10">
                <div className="w-14 h-14 rounded-full bg-black flex items-center justify-center text-white font-bold text-xl overflow-hidden">
                  {testimonial.avatar ? (
                    <img
                      src={testimonial.avatar}
                      alt={testimonial.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    testimonial.name.charAt(0)
                  )}
                </div>
                <div>
                  <p className="text-black font-bold text-lg">{testimonial.name}</p>
                  <p className="text-gray-600 text-sm">{testimonial.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HomeTestimonials;