import { motion } from "framer-motion";
import sportsImg from "@/assets/school-life-sports.jpg";
import learningImg from "@/assets/school-life-learning.jpg";
import artsImg from "@/assets/school-life-arts.jpg";

const activities = [
  { title: "Sports & Athletics", description: "Football, netball, athletics and swimming programs that build teamwork and fitness.", image: sportsImg },
  { title: "Academic Excellence", description: "A rigorous curriculum with dedicated teachers ensuring every child excels.", image: learningImg },
  { title: "Arts & Creativity", description: "Music, drama, visual arts and cultural programs that nurture creative expression.", image: artsImg },
];

const SchoolLifeSection = () => {
  return (
    <section id="school-life" className="py-20 bg-muted">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <span className="text-sm font-bold text-primary uppercase tracking-wider">Discover</span>
          <h2 className="font-heading font-black text-3xl md:text-5xl text-foreground mt-2">
            School Life at CABS
          </h2>
          <p className="text-muted-foreground mt-4 max-w-xl mx-auto">
            Our students thrive in a vibrant environment filled with learning, play, and growth opportunities.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {activities.map((item, i) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
              className="group bg-card rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow"
            >
              <div className="overflow-hidden h-56">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                  width={800}
                  height={600}
                />
              </div>
              <div className="p-6">
                <h3 className="font-heading font-bold text-xl text-foreground mb-2">{item.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{item.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SchoolLifeSection;
