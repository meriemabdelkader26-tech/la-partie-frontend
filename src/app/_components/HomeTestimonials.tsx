import { TESTIMONIALS } from "@/constant";

const HomeTestimonials = () => {
  return (
    <section className="py-20 px-4 border-t border-pastel-blue">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-4xl font-bold text-center text-pastel-dark-blue mb-16">
          What Our Users Say
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {TESTIMONIALS.map((testimonial, idx) => (
            <div
              key={idx}
              className="bg-pastel-blue/50 border border-pastel-blue rounded-lg p-6"
            >
              <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className="text-pastel-green">
                    ★
                  </span>
                ))}
              </div>
              <p className="text-pastel-blue mb-4">"{testimonial.content}"</p>
              <div className="flex items-center gap-3">
                <img
                  src={testimonial.avatar || "/placeholder.svg"}
                  alt={testimonial.name}
                  className="w-12 h-12 rounded-full border border-pastel-green/30"
                />
                <div>
                  <p className="text-pastel-dark-blue font-semibold">{testimonial.name}</p>
                  <p className="text-pastel-blue text-sm">{testimonial.role}</p>
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