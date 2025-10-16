import { Shield, Award, Users, Clock, Mountain, Heart } from "lucide-react";

export function WhyChooseUs() {
  const features = [
    {
      icon: Shield,
      title: "Safety First",
      description:
        "Our experienced guides prioritize your safety with comprehensive risk management and emergency protocols.",
    },
    {
      icon: Award,
      title: "Expert Guides",
      description:
        "Professional mountaineers with decades of experience on the world's most challenging peaks.",
    },
    {
      icon: Users,
      title: "Small Groups",
      description:
        "Intimate group sizes ensure personalized attention and a better climbing experience.",
    },
    {
      icon: Clock,
      title: "24/7 Support",
      description:
        "Round-the-clock support before, during, and after your expedition.",
    },
    {
      icon: Mountain,
      title: "Premium Equipment",
      description:
        "Top-quality gear and equipment provided for all expeditions.",
    },
    {
      icon: Heart,
      title: "Passion Driven",
      description:
        "We share your passion for adventure and are committed to making your dreams come true.",
    },
  ];

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Why Choose Tamil Adventure Treckking Club?
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            With over 15 years of experience, we've helped thousands of
            adventurers achieve their mountaineering goals safely and
            successfully.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="text-center p-6">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-teal-100 rounded-full mb-4">
                <feature.icon className="h-8 w-8 text-teal-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                {feature.title}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
