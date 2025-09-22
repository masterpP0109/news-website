import dotenv from 'dotenv';
import mongoose from 'mongoose';

dotenv.config({ path: '.env.local' });

// Blog Schema (matching the TypeScript interface)
const blogSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true, maxlength: 200 },
  content: { type: String, required: true },
  excerpt: { type: String, maxlength: 300 },
  author: { type: String, required: true, trim: true },
  category: {
    type: String,
    required: true,
    enum: ['politics', 'trending', 'hotSpot', 'editors', 'featured', 'other', 'world', 'sports', 'tech', 'modern', 'swimming', 'boxing', 'basketball', 'football'],
    default: 'other'
  },
  tags: [{ type: String, trim: true }],
  imageUrl: { type: String, trim: true },
  published: { type: Boolean, default: false },
  publishedAt: { type: Date },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Update the updatedAt field before saving
blogSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Index for better query performance
blogSchema.index({ category: 1, published: 1, publishedAt: -1 });
blogSchema.index({ title: 'text', content: 'text' });

const Blog = mongoose.model('Blog', blogSchema);

// Comprehensive blog data
const blogData = [
  // Politics Category (5 blogs)
  {
    title: "Breaking: Major Political Reform Announced",
    content: "In a surprising turn of events, the government has announced sweeping political reforms that promise to reshape the nation's democratic landscape. The reforms include new voting mechanisms, increased transparency in governance, and enhanced citizen participation. Experts are divided on the potential impact, with some praising the initiative as a step towards progress, while others warn of implementation challenges. This development comes at a critical time as the country prepares for upcoming elections.",
    excerpt: "Government unveils comprehensive political reforms aimed at strengthening democracy and citizen engagement.",
    author: "Sarah Johnson",
    category: "politics",
    tags: ["politics", "reform", "government", "democracy"],
    imageUrl: "/images/trendingArticle.jpg",
    published: true,
    publishedAt: new Date("2024-09-15T10:00:00.000Z"),
    createdAt: new Date("2024-09-14T15:30:00.000Z"),
    updatedAt: new Date("2024-09-15T10:00:00.000Z")
  },
  {
    title: "Election Results Spark National Debate",
    content: "The recent election results have ignited passionate discussions across the political spectrum. With voter turnout reaching record highs, the outcome reflects shifting demographics and changing priorities among the electorate. Political analysts are examining the implications for policy directions and coalition formations in the coming legislative session.",
    excerpt: "Historic election results prompt nationwide discussions on political future and policy priorities.",
    author: "Marcus Williams",
    category: "politics",
    tags: ["elections", "politics", "democracy", "policy"],
    imageUrl: "/images/featuredArticle2.jpg",
    published: true,
    publishedAt: new Date("2024-09-10T08:00:00.000Z"),
    createdAt: new Date("2024-09-09T12:15:00.000Z"),
    updatedAt: new Date("2024-09-10T08:00:00.000Z")
  },
  {
    title: "International Relations Take Center Stage",
    content: "Diplomatic tensions have escalated as world leaders navigate complex international relationships. Trade agreements, security alliances, and humanitarian concerns are shaping global politics in unprecedented ways. The coming months promise critical decisions that will impact international stability.",
    excerpt: "Global diplomatic landscape evolves with new challenges and opportunities for international cooperation.",
    author: "Dr. Elena Vasquez",
    category: "politics",
    tags: ["international", "diplomacy", "global politics", "security"],
    imageUrl: "/images/details.jpg",
    published: true,
    publishedAt: new Date("2024-09-08T14:30:00.000Z"),
    createdAt: new Date("2024-09-07T09:45:00.000Z"),
    updatedAt: new Date("2024-09-08T14:30:00.000Z")
  },
  {
    title: "Constitutional Changes Proposed",
    content: "Lawmakers have put forward ambitious constitutional amendments that could fundamentally alter the balance of power in government. The proposals address long-standing issues of representation, judicial independence, and executive authority. Public hearings are scheduled to gather citizen input before final votes.",
    excerpt: "Groundbreaking constitutional amendments proposed to address fundamental governance issues.",
    author: "Robert Chen",
    category: "politics",
    tags: ["constitution", "law", "government", "reform"],
    imageUrl: "/images/details1.jpg",
    published: true,
    publishedAt: new Date("2024-09-05T11:00:00.000Z"),
    createdAt: new Date("2024-09-04T16:20:00.000Z"),
    updatedAt: new Date("2024-09-05T11:00:00.000Z")
  },
  {
    title: "Political Campaign Strategies Evolve",
    content: "Modern political campaigns are leveraging technology and social media in innovative ways. Data analytics, targeted messaging, and digital engagement are transforming how candidates connect with voters. The 2024 election cycle showcases the most sophisticated campaign strategies ever deployed.",
    excerpt: "Digital revolution transforms political campaigning and voter engagement strategies.",
    author: "Jennifer Martinez",
    category: "politics",
    tags: ["campaigns", "technology", "social media", "elections"],
    imageUrl: "/images/featuredArticles1.jpg",
    published: true,
    publishedAt: new Date("2024-09-03T13:15:00.000Z"),
    createdAt: new Date("2024-09-02T10:30:00.000Z"),
    updatedAt: new Date("2024-09-03T13:15:00.000Z")
  },

  // HotSpot Category (5 blogs - will display only 3)
  {
    title: "Climate Summit Reaches Historic Agreement",
    content: "World leaders have reached a landmark agreement at the annual climate summit, committing to ambitious carbon reduction targets and increased funding for green initiatives. The pact includes binding commitments from 195 countries, with specific timelines for achieving net-zero emissions. Environmental groups have hailed the agreement as a turning point in the global fight against climate change, though critics argue the targets may not be aggressive enough given current scientific projections.",
    excerpt: "Global climate agreement sets new standards for environmental protection and sustainable development.",
    author: "Emma Rodriguez",
    category: "hotSpot",
    tags: ["climate", "environment", "global agreement", "sustainability"],
    imageUrl: "/images/8dcbc131d88730b6cc98c50376adc1e41fa4a88d.jpg",
    published: true,
    publishedAt: new Date("2024-09-13T16:30:00.000Z"),
    createdAt: new Date("2024-09-12T11:45:00.000Z"),
    updatedAt: new Date("2024-09-13T16:30:00.000Z")
  },
  {
    title: "Global Economic Indicators Show Recovery",
    content: "Economic data from major world markets indicates a robust recovery following recent global challenges. Employment figures, GDP growth, and consumer confidence metrics are all trending positively. However, experts caution about inflationary pressures and supply chain vulnerabilities that could impact long-term stability.",
    excerpt: "World economy demonstrates strong recovery with positive indicators across major markets.",
    author: "Dr. James Wilson",
    category: "hotSpot",
    tags: ["economy", "recovery", "global markets", "GDP"],
    imageUrl: "/images/9d1c816ec08975132090c7235cad45847b2b6e74.jpg",
    published: true,
    publishedAt: new Date("2024-09-12T09:00:00.000Z"),
    createdAt: new Date("2024-09-11T14:20:00.000Z"),
    updatedAt: new Date("2024-09-12T09:00:00.000Z")
  },
  {
    title: "Healthcare Breakthrough Announced",
    content: "Scientists have announced a major breakthrough in medical research that could revolutionize treatment approaches for chronic diseases. The new methodology combines advanced biotechnology with personalized medicine techniques, offering hope for millions of patients worldwide. Clinical trials are underway with promising preliminary results.",
    excerpt: "Revolutionary medical breakthrough promises new treatment options for chronic diseases.",
    author: "Dr. Lisa Chen",
    category: "hotSpot",
    tags: ["healthcare", "medical research", "breakthrough", "biotechnology"],
    imageUrl: "/images/9ef702ca7305c919b5a00d44bb32a112413051f4 (1).jpg",
    published: true,
    publishedAt: new Date("2024-09-11T12:45:00.000Z"),
    createdAt: new Date("2024-09-10T08:30:00.000Z"),
    updatedAt: new Date("2024-09-11T12:45:00.000Z")
  },
  {
    title: "Space Exploration Milestone Achieved",
    content: "Humanity has reached another significant milestone in space exploration with the successful completion of a complex orbital mission. The achievement opens new possibilities for deep space research and potential future colonization efforts. International cooperation has been key to this groundbreaking accomplishment.",
    excerpt: "Historic space exploration milestone expands humanity's reach beyond Earth.",
    author: "Captain Sarah Mitchell",
    category: "hotSpot",
    tags: ["space", "exploration", "milestone", "astronautics"],
    imageUrl: "/images/7406cb7123a2b62425fceebb60f7e30f241109c3.jpg",
    published: true,
    publishedAt: new Date("2024-09-09T15:20:00.000Z"),
    createdAt: new Date("2024-09-08T10:15:00.000Z"),
    updatedAt: new Date("2024-09-09T15:20:00.000Z")
  },
  {
    title: "Cybersecurity Threats Intensify",
    content: "Global cybersecurity experts are warning of escalating digital threats targeting critical infrastructure and personal data. Advanced persistent threats and sophisticated attack vectors are challenging traditional defense mechanisms. Governments and corporations are investing heavily in next-generation security solutions.",
    excerpt: "Rising cybersecurity threats demand urgent global response and advanced protection strategies.",
    author: "Alex Thompson",
    category: "hotSpot",
    tags: ["cybersecurity", "threats", "digital security", "infrastructure"],
    imageUrl: "/images/8471e75fe110f1871ae8ab7eafbf883806222f1b (1).jpg",
    published: true,
    publishedAt: new Date("2024-09-07T17:00:00.000Z"),
    createdAt: new Date("2024-09-06T13:40:00.000Z"),
    updatedAt: new Date("2024-09-07T17:00:00.000Z")
  },

  // Trending Category (4 blogs)
  {
    title: "Tech Giant Unveils Revolutionary AI Technology",
    content: "Leading technology company has just released its latest AI innovation that promises to transform industries worldwide. The new system combines advanced machine learning with quantum computing capabilities, offering unprecedented processing speeds and accuracy. Early adopters in healthcare and finance sectors report significant improvements in efficiency and decision-making processes. Industry analysts predict this could be the biggest breakthrough in AI since the introduction of deep learning.",
    excerpt: "Groundbreaking AI technology from tech giant set to revolutionize multiple industries with quantum-enhanced processing.",
    author: "Michael Chen",
    category: "trending",
    tags: ["technology", "AI", "innovation", "quantum computing"],
    imageUrl: "/images/8471e75fe110f1871ae8ab7eafbf883806222f1b.jpg",
    published: true,
    publishedAt: new Date("2024-09-14T14:00:00.000Z"),
    createdAt: new Date("2024-09-13T09:15:00.000Z"),
    updatedAt: new Date("2024-09-14T14:00:00.000Z")
  },
  {
    title: "Social Media Algorithms Face Regulation",
    content: "Regulatory bodies are increasingly scrutinizing social media algorithms and their impact on user behavior and societal discourse. New legislation aims to increase transparency in content recommendation systems and protect users from harmful algorithmic biases. Tech companies are responding with enhanced ethical AI frameworks and user control features.",
    excerpt: "Social media algorithms come under regulatory scrutiny with new transparency requirements.",
    author: "Rachel Green",
    category: "trending",
    tags: ["social media", "algorithms", "regulation", "ethics"],
    imageUrl: "/images/49910a30f90d7b75d4274fd2610e0c65f8dbea4d.jpg",
    published: true,
    publishedAt: new Date("2024-09-06T10:30:00.000Z"),
    createdAt: new Date("2024-09-05T15:45:00.000Z"),
    updatedAt: new Date("2024-09-06T10:30:00.000Z")
  },
  {
    title: "Cryptocurrency Market Volatility Continues",
    content: "Digital asset markets are experiencing significant volatility as regulatory developments and technological advancements reshape the cryptocurrency landscape. Institutional adoption is growing, but concerns about market stability and consumer protection remain prominent topics of discussion among industry stakeholders.",
    excerpt: "Cryptocurrency markets navigate volatility amid regulatory changes and technological evolution.",
    author: "David Kim",
    category: "trending",
    tags: ["cryptocurrency", "blockchain", "finance", "regulation"],
    imageUrl: "/images/203910a0bc40a9ec4bfe150d416c6182bd82bee1.jpg",
    published: true,
    publishedAt: new Date("2024-09-04T16:45:00.000Z"),
    createdAt: new Date("2024-09-03T11:20:00.000Z"),
    updatedAt: new Date("2024-09-04T16:45:00.000Z")
  },
  {
    title: "Remote Work Culture Evolves",
    content: "The remote work revolution continues to transform organizational culture and workplace dynamics. Companies are developing sophisticated hybrid models that balance flexibility with collaboration. Employee satisfaction metrics show mixed results, with productivity gains offset by challenges in team cohesion and professional development.",
    excerpt: "Remote work culture matures with new hybrid models and evolving workplace dynamics.",
    author: "Maria Sanchez",
    category: "trending",
    tags: ["remote work", "culture", "hybrid", "workplace"],
    imageUrl: "/images/a7f20d2dd05a08e6d6b0690cd0e0ef4e831d8cf6 (1).jpg",
    published: true,
    publishedAt: new Date("2024-09-02T14:20:00.000Z"),
    createdAt: new Date("2024-09-01T09:10:00.000Z"),
    updatedAt: new Date("2024-09-02T14:20:00.000Z")
  },

  // Editors Category (4 blogs)
  {
    title: "Editor's Choice: The Future of Remote Work",
    content: "As hybrid work models become the new normal, companies are reevaluating their approach to remote work policies. This in-depth analysis explores the benefits and challenges of distributed teams, including productivity metrics, employee satisfaction, and cost implications. Drawing from recent studies and expert interviews, we examine how successful organizations are adapting to this paradigm shift and what lessons can be learned for the broader workforce.",
    excerpt: "Comprehensive analysis of remote work trends and their impact on modern business practices.",
    author: "David Thompson",
    category: "editors",
    tags: ["remote work", "business", "productivity", "work culture"],
    imageUrl: "/images/a7f20d2dd05a08e6d6b0690cd0e0ef4e831d8cf6 (2).jpg",
    published: true,
    publishedAt: new Date("2024-09-12T12:00:00.000Z"),
    createdAt: new Date("2024-09-11T08:20:00.000Z"),
    updatedAt: new Date("2024-09-12T12:00:00.000Z")
  },
  {
    title: "Deep Dive: Urban Planning Challenges",
    content: "Modern cities face unprecedented challenges in infrastructure development and sustainable growth. This comprehensive examination explores the complex interplay between population density, environmental concerns, and economic development. Innovative solutions from around the world offer insights into creating livable, resilient urban environments for future generations.",
    excerpt: "In-depth exploration of urban planning challenges and innovative solutions for sustainable cities.",
    author: "Prof. Alan Richards",
    category: "editors",
    tags: ["urban planning", "cities", "sustainability", "infrastructure"],
    imageUrl: "/images/b0066476786d2d74e854296ab9666b2a9c729a34.jpg",
    published: true,
    publishedAt: new Date("2024-08-28T10:15:00.000Z"),
    createdAt: new Date("2024-08-27T14:30:00.000Z"),
    updatedAt: new Date("2024-08-28T10:15:00.000Z")
  },
  {
    title: "Education System Transformation",
    content: "Educational institutions worldwide are undergoing fundamental transformations driven by technology and changing societal needs. From personalized learning platforms to competency-based assessments, the education landscape is evolving rapidly. This analysis examines the successes, challenges, and future directions of modern education reform initiatives.",
    excerpt: "Education systems worldwide undergo transformation with technology and innovative teaching methods.",
    author: "Dr. Susan Parker",
    category: "editors",
    tags: ["education", "technology", "reform", "learning"],
    imageUrl: "/images/c829d06b1c01e9795784bc9c26ad4e4fa967e3f7.jpg",
    published: true,
    publishedAt: new Date("2024-08-25T13:45:00.000Z"),
    createdAt: new Date("2024-08-24T09:50:00.000Z"),
    updatedAt: new Date("2024-08-25T13:45:00.000Z")
  },
  {
    title: "Cultural Preservation in Digital Age",
    content: "The intersection of traditional cultural practices and digital technology presents both opportunities and challenges for cultural preservation. Indigenous communities and cultural institutions are leveraging digital tools to document, share, and protect cultural heritage. This exploration examines successful case studies and emerging best practices in digital cultural preservation.",
    excerpt: "Digital technology offers new approaches to preserving cultural heritage and traditions.",
    author: "Dr. Maya Patel",
    category: "editors",
    tags: ["culture", "digital preservation", "heritage", "technology"],
    imageUrl: "/images/logo.png.png",
    published: true,
    publishedAt: new Date("2024-08-22T11:30:00.000Z"),
    createdAt: new Date("2024-08-21T16:15:00.000Z"),
    updatedAt: new Date("2024-08-22T11:30:00.000Z")
  },

  // Featured Category (4 blogs)
  {
    title: "Cultural Festival Celebrates Diversity",
    content: "The annual cultural festival brought together artists, musicians, and performers from around the world to celebrate human diversity and creativity. Featuring traditional dances, contemporary art installations, and culinary experiences from 50 different countries, the event attracted over 100,000 visitors. Organizers emphasized the importance of cultural exchange in fostering understanding and unity in an increasingly interconnected world.",
    excerpt: "International cultural festival showcases global diversity through art, music, and culinary traditions.",
    author: "Lisa Park",
    category: "featured",
    tags: ["culture", "festival", "diversity", "arts"],
    imageUrl: "/images/nw_banner_post02.jpg.png",
    published: true,
    publishedAt: new Date("2024-09-11T18:00:00.000Z"),
    createdAt: new Date("2024-09-10T14:10:00.000Z"),
    updatedAt: new Date("2024-09-11T18:00:00.000Z")
  },

  // World Category (5 blogs)
  {
    title: "Global Trade Agreements Reshaping Economies",
    content: "New international trade agreements are fundamentally changing how countries conduct business and manage economic relationships. The agreements focus on digital trade, environmental standards, and labor rights, creating a more interconnected global marketplace. Economists predict these changes will boost growth but also require significant adaptation from businesses worldwide.",
    excerpt: "International trade agreements create new economic opportunities and challenges for global businesses.",
    author: "Dr. Maria Gonzalez",
    category: "world",
    tags: ["trade", "economy", "global", "agreements"],
    imageUrl: "/images/trendingArticle.jpg",
    published: true,
    publishedAt: new Date("2024-09-16T10:00:00.000Z"),
    createdAt: new Date("2024-09-15T15:30:00.000Z"),
    updatedAt: new Date("2024-09-16T10:00:00.000Z")
  },
  {
    title: "International Climate Cooperation Advances",
    content: "Countries around the world are intensifying their cooperation on climate change mitigation, with new partnerships forming between developed and developing nations. Innovative financing mechanisms and technology transfers are accelerating the transition to sustainable energy systems. The collaborative approach marks a significant shift from previous competitive strategies.",
    excerpt: "Global climate cooperation reaches new heights with innovative partnerships and technology sharing.",
    author: "Prof. Ahmed Hassan",
    category: "world",
    tags: ["climate", "cooperation", "sustainability", "global"],
    imageUrl: "/images/featuredArticle2.jpg",
    published: true,
    publishedAt: new Date("2024-09-14T12:00:00.000Z"),
    createdAt: new Date("2024-09-13T09:15:00.000Z"),
    updatedAt: new Date("2024-09-14T12:00:00.000Z")
  },
  {
    title: "Digital Transformation in Global Education",
    content: "Educational institutions worldwide are embracing digital technologies to enhance learning experiences and expand access to quality education. Online platforms, virtual reality classrooms, and AI-powered tutoring systems are breaking down geographical barriers. The transformation is particularly impactful in developing regions where traditional educational infrastructure has been limited.",
    excerpt: "Digital technologies revolutionize global education, expanding access and improving learning outcomes.",
    author: "Dr. Sarah Kim",
    category: "world",
    tags: ["education", "digital", "technology", "global"],
    imageUrl: "/images/details.jpg",
    published: true,
    publishedAt: new Date("2024-09-12T14:30:00.000Z"),
    createdAt: new Date("2024-09-11T11:45:00.000Z"),
    updatedAt: new Date("2024-09-12T14:30:00.000Z")
  },
  {
    title: "Global Health Initiatives Combat Pandemics",
    content: "International health organizations are strengthening global pandemic preparedness through enhanced surveillance systems and rapid response mechanisms. New vaccine development platforms and improved international coordination are key components of the strategy. The initiatives aim to prevent future health crises and ensure equitable access to medical interventions worldwide.",
    excerpt: "International health cooperation strengthens global pandemic preparedness and response capabilities.",
    author: "Dr. James Mitchell",
    category: "world",
    tags: ["health", "pandemic", "global", "preparedness"],
    imageUrl: "/images/details1.jpg",
    published: true,
    publishedAt: new Date("2024-09-10T16:00:00.000Z"),
    createdAt: new Date("2024-09-09T13:20:00.000Z"),
    updatedAt: new Date("2024-09-10T16:00:00.000Z")
  },
  {
    title: "Cultural Exchange Programs Foster Understanding",
    content: "International cultural exchange programs are promoting cross-cultural understanding and building bridges between diverse communities. Art exhibitions, music festivals, and academic collaborations are creating new opportunities for people to learn about different cultures and traditions. These initiatives are particularly important in an era of increasing globalization and cultural diversity.",
    excerpt: "Cultural exchange programs build bridges between communities and promote global understanding.",
    author: "Maria Rodriguez",
    category: "world",
    tags: ["culture", "exchange", "global", "understanding"],
    imageUrl: "/images/featuredArticles1.jpg",
    published: true,
    publishedAt: new Date("2024-09-08T18:00:00.000Z"),
    createdAt: new Date("2024-09-07T14:10:00.000Z"),
    updatedAt: new Date("2024-09-08T18:00:00.000Z")
  },

  // Tech Category (3 blogs)
  {
    title: "Quantum Computing Breakthrough Accelerates Research",
    content: "Scientists have achieved a major breakthrough in quantum computing, developing more stable qubits that maintain coherence for longer periods. This advancement brings practical quantum computing applications closer to reality, with potential impacts on drug discovery, financial modeling, and artificial intelligence. Research institutions worldwide are racing to build on this foundational discovery.",
    excerpt: "Quantum computing breakthrough promises revolutionary advances in multiple scientific fields.",
    author: "Dr. Robert Chen",
    category: "tech",
    tags: ["quantum", "computing", "technology", "research"],
    imageUrl: "/images/8dcbc131d88730b6cc98c50376adc1e41fa4a88d.jpg",
    published: true,
    publishedAt: new Date("2024-09-15T11:00:00.000Z"),
    createdAt: new Date("2024-09-14T16:30:00.000Z"),
    updatedAt: new Date("2024-09-15T11:00:00.000Z")
  },
  {
    title: "AI Ethics Frameworks Gain Global Adoption",
    content: "International organizations are developing comprehensive ethical frameworks for artificial intelligence development and deployment. The frameworks address bias mitigation, transparency requirements, and accountability measures. Companies and governments are increasingly adopting these standards to ensure responsible AI development that benefits society while minimizing potential harms.",
    excerpt: "Global AI ethics frameworks establish standards for responsible artificial intelligence development.",
    author: "Dr. Lisa Thompson",
    category: "tech",
    tags: ["AI", "ethics", "technology", "regulation"],
    imageUrl: "/images/9d1c816ec08975132090c7235cad45847b2b6e74.jpg",
    published: true,
    publishedAt: new Date("2024-09-13T13:30:00.000Z"),
    createdAt: new Date("2024-09-12T10:45:00.000Z"),
    updatedAt: new Date("2024-09-13T13:30:00.000Z")
  },
  {
    title: "5G Networks Enable Smart City Innovations",
    content: "The rollout of 5G networks is enabling revolutionary smart city applications, from autonomous transportation systems to advanced healthcare monitoring. Cities worldwide are leveraging the high-speed, low-latency connectivity to improve efficiency and quality of life. The technology is particularly transformative in traffic management, emergency response, and environmental monitoring.",
    excerpt: "5G technology powers smart city innovations, transforming urban infrastructure and services.",
    author: "Mark Johnson",
    category: "tech",
    tags: ["5G", "smart cities", "technology", "infrastructure"],
    imageUrl: "/images/9ef702ca7305c919b5a00d44bb32a112413051f4 (1).jpg",
    published: true,
    publishedAt: new Date("2024-09-11T15:00:00.000Z"),
    createdAt: new Date("2024-09-10T12:15:00.000Z"),
    updatedAt: new Date("2024-09-11T15:00:00.000Z")
  },

  // Modern Category (3 blogs)
  {
    title: "Sustainable Fashion Revolution Gains Momentum",
    content: "The fashion industry is undergoing a sustainable transformation, with designers and brands adopting eco-friendly materials and ethical production practices. Consumers are increasingly demanding transparency and environmental responsibility from fashion companies. The shift is creating new opportunities for innovation while challenging traditional business models in the industry.",
    excerpt: "Sustainable fashion movement transforms industry practices and consumer expectations.",
    author: "Emma Davis",
    category: "modern",
    tags: ["fashion", "sustainability", "environment", "ethics"],
    imageUrl: "/images/7406cb7123a2b62425fceebb60f7e30f241109c3.jpg",
    published: true,
    publishedAt: new Date("2024-09-14T10:30:00.000Z"),
    createdAt: new Date("2024-09-13T15:45:00.000Z"),
    updatedAt: new Date("2024-09-14T10:30:00.000Z")
  },
  {
    title: "Mental Health Awareness Campaigns Expand",
    content: "Global mental health awareness campaigns are breaking down stigma and increasing access to mental health services. Innovative approaches combining technology, community support, and professional care are proving effective. The campaigns are particularly impactful in workplace settings and educational institutions, where early intervention can prevent long-term issues.",
    excerpt: "Mental health awareness campaigns reduce stigma and improve access to support services.",
    author: "Dr. Sarah Williams",
    category: "modern",
    tags: ["mental health", "awareness", "wellness", "support"],
    imageUrl: "/images/8471e75fe110f1871ae8ab7eafbf883806222f1b (1).jpg",
    published: true,
    publishedAt: new Date("2024-09-12T12:15:00.000Z"),
    createdAt: new Date("2024-09-11T09:30:00.000Z"),
    updatedAt: new Date("2024-09-12T12:15:00.000Z")
  },
  {
    title: "Plant-Based Diets Transform Food Industry",
    content: "Plant-based food alternatives are revolutionizing the food industry, with innovative products challenging traditional meat and dairy markets. Advances in food technology are creating more appealing and nutritious plant-based options. The shift is driven by health, environmental, and ethical considerations, with significant implications for agriculture and food systems worldwide.",
    excerpt: "Plant-based food revolution transforms dietary habits and food industry practices.",
    author: "Chef Michael Brown",
    category: "modern",
    tags: ["food", "plant-based", "health", "environment"],
    imageUrl: "/images/8471e75fe110f1871ae8ab7eafbf883806222f1b.jpg",
    published: true,
    publishedAt: new Date("2024-09-10T14:45:00.000Z"),
    createdAt: new Date("2024-09-09T11:00:00.000Z"),
    updatedAt: new Date("2024-09-10T14:45:00.000Z")
  },

  // Sports Category (5 blogs)
  {
    title: "Olympic Games Set New Participation Records",
    content: "The latest Olympic Games achieved unprecedented levels of participation, with athletes from over 200 countries competing in diverse sporting events. The games showcased remarkable athletic achievements and international cooperation. Innovations in sports technology and training methods contributed to record-breaking performances across multiple disciplines.",
    excerpt: "Olympic Games achieve record participation and showcase international sporting excellence.",
    author: "John Martinez",
    category: "sports",
    tags: ["olympics", "athletics", "records", "international"],
    imageUrl: "/images/49910a30f90d7b75d4274fd2610e0c65f8dbea4d.jpg",
    published: true,
    publishedAt: new Date("2024-09-16T09:00:00.000Z"),
    createdAt: new Date("2024-09-15T14:30:00.000Z"),
    updatedAt: new Date("2024-09-16T09:00:00.000Z")
  },
  {
    title: "Esports Industry Reaches Billion-Dollar Milestone",
    content: "The esports industry has surpassed the billion-dollar revenue mark, establishing itself as a major entertainment sector. Professional gaming tournaments attract millions of viewers worldwide, with top players earning substantial incomes. The industry's growth is driven by advances in gaming technology and increasing mainstream acceptance of competitive gaming as a legitimate sport.",
    excerpt: "Esports industry achieves billion-dollar status, transforming competitive gaming into mainstream entertainment.",
    author: "Alex Chen",
    category: "sports",
    tags: ["esports", "gaming", "entertainment", "competition"],
    imageUrl: "/images/203910a0bc40a9ec4bfe150d416c6182bd82bee1.jpg",
    published: true,
    publishedAt: new Date("2024-09-14T11:30:00.000Z"),
    createdAt: new Date("2024-09-13T16:45:00.000Z"),
    updatedAt: new Date("2024-09-14T11:30:00.000Z")
  },
  {
    title: "Women's Sports Gain Global Recognition",
    content: "Women's sports are receiving increased global recognition and investment, with major leagues and international competitions expanding opportunities for female athletes. Improved media coverage and corporate sponsorships are helping to close the gender gap in sports. The movement is empowering women and girls while challenging traditional perceptions of athletic achievement.",
    excerpt: "Women's sports receive growing global recognition and investment opportunities.",
    author: "Sarah Johnson",
    category: "sports",
    tags: ["women's sports", "equality", "recognition", "empowerment"],
    imageUrl: "/images/a7f20d2dd05a08e6d6b0690cd0e0ef4e831d8cf6 (1).jpg",
    published: true,
    publishedAt: new Date("2024-09-12T13:00:00.000Z"),
    createdAt: new Date("2024-09-11T10:15:00.000Z"),
    updatedAt: new Date("2024-09-12T13:00:00.000Z")
  },
  {
    title: "Sports Technology Enhances Performance",
    content: "Advanced technology is revolutionizing sports performance, from wearable devices tracking athlete metrics to AI-powered training programs. Virtual reality training simulations and biomechanical analysis are helping athletes optimize their techniques and prevent injuries. The integration of technology is making sports more scientific and data-driven than ever before.",
    excerpt: "Sports technology revolution enhances athlete performance and training methodologies.",
    author: "Dr. Michael Roberts",
    category: "sports",
    tags: ["sports tech", "performance", "training", "innovation"],
    imageUrl: "/images/a7f20d2dd05a08e6d6b0690cd0e0ef4e831d8cf6 (2).jpg",
    published: true,
    publishedAt: new Date("2024-09-10T15:30:00.000Z"),
    createdAt: new Date("2024-09-09T12:45:00.000Z"),
    updatedAt: new Date("2024-09-10T15:30:00.000Z")
  },
  {
    title: "Youth Sports Programs Combat Obesity Crisis",
    content: "Community-based youth sports programs are playing a crucial role in combating childhood obesity and promoting healthy lifestyles. Programs combining physical activity with nutritional education are showing significant results in improving children's health outcomes. The initiatives are particularly effective in underserved communities where access to sports facilities has traditionally been limited.",
    excerpt: "Youth sports programs effectively combat obesity and promote healthy lifestyles among children.",
    author: "Dr. Jennifer Lee",
    category: "sports",
    tags: ["youth sports", "health", "obesity", "community"],
    imageUrl: "/images/b0066476786d2d74e854296ab9666b2a9c729a34.jpg",
    published: true,
    publishedAt: new Date("2024-09-08T17:00:00.000Z"),
    createdAt: new Date("2024-09-07T13:15:00.000Z"),
    updatedAt: new Date("2024-09-08T17:00:00.000Z")
  },

  // Swimming Category (2 blogs)
  {
    title: "Swimming Records Shattered at International Championships",
    content: "Elite swimmers achieved remarkable performances at the international championships, breaking multiple world records in various events. The victories highlight advances in training techniques, nutrition, and sports science. Young swimmers are particularly impressive, showing the sport's bright future and the effectiveness of modern development programs.",
    excerpt: "International swimming championships feature record-breaking performances and emerging talent.",
    author: "Coach David Wilson",
    category: "swimming",
    tags: ["swimming", "records", "championships", "athletics"],
    imageUrl: "/images/c829d06b1c01e9795784bc9c26ad4e4fa967e3f7.jpg",
    published: true,
    publishedAt: new Date("2024-09-15T12:00:00.000Z"),
    createdAt: new Date("2024-09-14T17:30:00.000Z"),
    updatedAt: new Date("2024-09-15T12:00:00.000Z")
  },
  {
    title: "Open Water Swimming Gains Popularity",
    content: "Open water swimming is experiencing a surge in popularity, with more people participating in lake, river, and ocean races. The sport offers unique challenges and benefits compared to pool swimming, including navigation skills and environmental awareness. Growing interest is leading to more organized events and improved safety measures for participants.",
    excerpt: "Open water swimming grows in popularity with increased participation and organized events.",
    author: "Emma Thompson",
    category: "swimming",
    tags: ["open water", "swimming", "outdoor", "fitness"],
    imageUrl: "/images/logo.png.png",
    published: true,
    publishedAt: new Date("2024-09-13T14:30:00.000Z"),
    createdAt: new Date("2024-09-12T11:45:00.000Z"),
    updatedAt: new Date("2024-09-13T14:30:00.000Z")
  },

  // Boxing Category (2 blogs)
  {
    title: "Boxing Champions Dominate World Stage",
    content: "Professional boxers are achieving unprecedented success on the global stage, with champions from diverse backgrounds inspiring new generations. The sport's international appeal continues to grow, with major fights drawing massive audiences worldwide. Advances in training methods and sports medicine are contributing to longer, more successful careers for elite boxers.",
    excerpt: "Boxing champions achieve global success and inspire international sporting interest.",
    author: "Mike Rodriguez",
    category: "boxing",
    tags: ["boxing", "champions", "international", "competition"],
    imageUrl: "/images/nw_banner_post02.jpg.png",
    published: true,
    publishedAt: new Date("2024-09-14T16:00:00.000Z"),
    createdAt: new Date("2024-09-13T12:15:00.000Z"),
    updatedAt: new Date("2024-09-14T16:00:00.000Z")
  },
  {
    title: "Boxing Safety Protocols Enhanced",
    content: "Boxing governing bodies have implemented enhanced safety protocols to protect fighters and improve the sport's integrity. New medical requirements, concussion protocols, and weight management standards are reducing risks. The changes reflect growing awareness of athlete health and safety in combat sports, setting new industry standards.",
    excerpt: "Boxing implements enhanced safety protocols to protect athletes and improve sport integrity.",
    author: "Dr. Lisa Martinez",
    category: "boxing",
    tags: ["boxing", "safety", "health", "protocols"],
    imageUrl: "/images/trendingArticle.png",
    published: true,
    publishedAt: new Date("2024-09-12T18:30:00.000Z"),
    createdAt: new Date("2024-09-11T15:45:00.000Z"),
    updatedAt: new Date("2024-09-12T18:30:00.000Z")
  },

  // Basketball Category (2 blogs)
  {
    title: "Basketball Leagues Expand Globally",
    content: "Professional basketball leagues are expanding internationally, with new teams and competitions emerging in Asia, Europe, and Africa. The globalization is bringing diverse playing styles and increasing the sport's worldwide popularity. International players are gaining recognition in major leagues, creating new opportunities and cultural exchanges in basketball.",
    excerpt: "Basketball leagues expand globally, bringing diverse talent and increasing international popularity.",
    author: "Coach James Parker",
    category: "basketball",
    tags: ["basketball", "global", "expansion", "international"],
    imageUrl: "/images/logo.png.png",
    published: true,
    publishedAt: new Date("2024-09-13T10:00:00.000Z"),
    createdAt: new Date("2024-09-12T15:30:00.000Z"),
    updatedAt: new Date("2024-09-13T10:00:00.000Z")
  },
  {
    title: "Youth Basketball Programs Develop Talent",
    content: "Youth basketball development programs are identifying and nurturing young talent worldwide, creating pathways to professional careers. Innovative training methods and international competitions are helping young players develop skills and gain exposure. The programs emphasize fundamentals, sportsmanship, and academic achievement alongside athletic development.",
    excerpt: "Youth basketball programs develop global talent and create professional pathways.",
    author: "Sarah Williams",
    category: "basketball",
    tags: ["basketball", "youth", "development", "talent"],
    imageUrl: "/images/logo.png.png",
    published: true,
    publishedAt: new Date("2024-09-11T12:30:00.000Z"),
    createdAt: new Date("2024-09-10T09:45:00.000Z"),
    updatedAt: new Date("2024-09-11T12:30:00.000Z")
  },

  // Football Category (2 blogs)
  {
    title: "Football World Cup Generates Record Viewership",
    content: "The Football World Cup achieved record global viewership, uniting billions of fans in celebration of the world's most popular sport. The tournament showcased exceptional athletic talent and national pride, with matches broadcast in over 200 countries. The economic impact of the event was substantial, benefiting host nations and the global sports industry.",
    excerpt: "Football World Cup achieves record viewership and demonstrates sport's global appeal.",
    author: "Carlos Mendoza",
    category: "football",
    tags: ["football", "world cup", "viewership", "global"],
    imageUrl: "/images/logo.png.png",
    published: true,
    publishedAt: new Date("2024-09-15T08:00:00.000Z"),
    createdAt: new Date("2024-09-14T13:30:00.000Z"),
    updatedAt: new Date("2024-09-15T08:00:00.000Z")
  },
  {
    title: "Football Technology Improves Game Quality",
    content: "Advanced technology is enhancing football matches, from video assistant referees to goal-line technology and player tracking systems. These innovations are improving accuracy in decision-making and providing fans with enhanced viewing experiences. The technology is also helping coaches analyze performance and develop more effective training programs.",
    excerpt: "Football technology enhances game accuracy and provides improved viewing experiences.",
    author: "Tech Analyst David Brown",
    category: "football",
    tags: ["football", "technology", "VAR", "analysis"],
    imageUrl: "/images/logo.png.png",
    published: true,
    publishedAt: new Date("2024-09-13T16:00:00.000Z"),
    createdAt: new Date("2024-09-12T11:15:00.000Z"),
    updatedAt: new Date("2024-09-13T16:00:00.000Z")
  }
];

async function seedDatabase() {
  try {
    // Validate environment variables
    if (!process.env.MONGODB_URI) {
      console.error('❌ Error: MONGODB_URI environment variable is not set');
      console.error('Please set your MongoDB connection string in .env.local');
      process.exit(1);
    }

    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('✅ Connected to MongoDB Atlas successfully');
    console.log('Database:', mongoose.connection.db.databaseName);

    // Clear existing data
    console.log('🧹 Clearing existing blog data...');
    await Blog.deleteMany({});

    // Insert new data
    console.log('📝 Inserting comprehensive blog data...');
    const insertedBlogs = await Blog.insertMany(blogData);

    console.log(`✅ Successfully seeded ${insertedBlogs.length} blogs!`);
    console.log('📊 Blog distribution by category:');

    const categoryStats = await Blog.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    categoryStats.forEach(stat => {
      console.log(`  ${stat._id}: ${stat.count} blogs`);
    });

    console.log('\n🎉 Database seeding completed successfully!');

  } catch (error) {
    console.error('❌ Error seeding database:', error.message);
    process.exit(1);
  } finally {
    await mongoose.connection.close();
    console.log('🔌 Database connection closed');
  }
}

// Run the seed function
seedDatabase();
