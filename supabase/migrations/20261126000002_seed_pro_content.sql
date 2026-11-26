-- 02: Seed Pro Lessons and Exam Passages (Server-enforced content)

INSERT INTO public.passages_pro (id, language, exam_type, title, content, duration, word_count) VALUES
-- English SSC / High Court Passages
('pro-pass-en-01', 'english', 'ssc', 'Indian Constitution and Democratic Governance', 'The Constitution of India represents the supreme fundamental law of the country. Enacted by the Constituent Assembly on twenty-sixth November nineteen forty-nine, it guarantees justice, liberty, equality, and fraternity to every citizen. The constitutional framework establishes a sovereign, socialist, secular, and democratic republic with an independent judiciary.', 600, 360),
('pro-pass-en-02', 'english', 'high_court', 'Judicial Precedents and the Rule of Law', 'In common law jurisprudence, judicial precedent plays a pivotal role in ensuring institutional stability and predictable adjudication. Subordinate courts are bound by the legal rulings of the Supreme Court of India under Article one hundred forty-one of the Constitution. Equitable administration of justice necessitates transparent case proceedings and sound judicial discretion.', 600, 355),
('pro-pass-en-03', 'english', 'cpct', 'Digital Transformation in Public Administration', 'Information technology has fundamentally restructured public service delivery across modern administrative bodies. Digital platforms, electronic portals, and secure online verification streamline bureaucratic processes, reducing procedural delays and enhancing citizen trust in government infrastructure.', 600, 340),

-- Hindi SSC / High Court Passages
('pro-pass-hi-01', 'hindi', 'ssc', 'संसदीय लोकतंत्र और निर्वाचन प्रणाली', 'भारत का निर्वाचन आयोग एक स्वायत्त संवैधानिक प्राधिकरण है जो भारत में संघ और राज्य चुनाव प्रक्रियाओं के संचालन के लिए उत्तरदायी है। स्वतंत्र और निष्पक्ष निर्वाचन किसी भी लोकतांत्रिक राष्ट्र की आधारशिला होते हैं। जनमत की शुचिता बनाए रखने के लिए नागरिकों में राजनीतिक जागरूकता अत्यंत आवश्यक है।', 600, 310),
('pro-pass-hi-02', 'hindi', 'high_court', 'न्यायालयीन प्रक्रिया एवं विधिक साक्षरता', 'उच्च न्यायालय राज्य के न्यायिक प्रशासन का सर्वोच्च अंग होता है। न्यायपालिका का प्राथमिक दायित्व नागरिकों के मौलिक अधिकारों का संरक्षण तथा विधि के शासन को अक्षुण्ण बनाए रखना है। त्वरित न्याय व्यवस्था और विधिक सहायता तंत्र समाज के अंतिम व्यक्ति तक न्याय सुनिश्चित करते हैं।', 600, 305),
('pro-pass-hi-03', 'hindi', 'cpct', 'मध्य प्रदेश का ऐतिहासिक एवं सांस्कृतिक गौरव', 'मध्य प्रदेश भारत का हृदय स्थल कहलाता है। नर्मदा नदी की पावन घाटी प्राचीन सभ्यताओं की साक्षी रही है। खजुराहो के भव्य मंदिर, साँची का बौद्ध स्तूप और भीमबेटका के शैलचित्र हमारी समृद्ध सांस्कृतिक विरासत के परिचायक हैं। राज्य का प्राकृतिक सौंदर्य और वन संपदा अनुपम है।', 600, 320)
ON CONFLICT (id) DO NOTHING;

-- Seed Sample Pro Lessons
INSERT INTO public.lessons_pro (id, track, level, lesson_number, title, intro, content, target_wpm, target_accuracy, keys_taught) VALUES
('pro-c4-l1', 'english', 4, 1, 'Symbols & Mathematical Operators', 'Master brackets, percentage, and mathematical notation without looking at the keyboard.', 'cost = (price * 1.18) + shipping; total_tax = 18%; ratio >= 50% && score <= 100%;', 40, 95, ARRAY['%', '&', '+', '=', '(', ')', ';']),
('pro-c4-l2', 'english', 4, 2, 'Legal & Administrative Terminology', 'Practice high-velocity transcriptions of formal administrative vocabulary.', 'whereas the petitioner submits that jurisdiction of appellate authority is strictly statutory and mandatory.', 45, 96, ARRAY['w', 'h', 'e', 'r', 'a', 's', 'p', 't']),
('pro-hi-ins-l20', 'inscript', 4, 1, 'संयुक्त अक्षर एवं हलंत संयोजन', 'इनस्क्रिप्ट में क्ष, त्र, ज्ञ एवं श्र का तीव्र गति से अभ्यास।', 'क्षमाशील व्यक्ति समाज में आदरणीय होता है। ज्ञान ही मनुष्य का सच्चा मित्र है।', 32, 95, ARRAY['क्ष', 'त्र', 'ज्ञ', 'श्र']),
('pro-hi-rem-l20', 'remington', 4, 1, 'रेमिंगटन पूर्व-मात्रा एवं रेफ अभ्यास', 'रेमिंगटन गेल में छोटी इ की मात्रा और र् (रेफ) का निरंतर अभ्यास।', 'कर्म ही पूजा है। धर्म और न्याय की विजय होती है। कर्तव्य का पालन सर्वोत्तम धर्म है।', 30, 95, ARRAY['ि', 'र्', 'म', 'न'])
ON CONFLICT (id) DO NOTHING;
