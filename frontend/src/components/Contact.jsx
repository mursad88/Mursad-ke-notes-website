function Contact() {
  const whatsappNumber = "917017576551"; // 91 देश का कोड है ताकि डायरेक्ट WhatsApp खुले
  const email = "gopalsingh885910@gmail.com";

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-20 px-6 flex items-center justify-center">
      <div className="max-w-xl w-full bg-slate-900 border border-slate-800 rounded-3xl p-8 md:p-12 shadow-2xl relative overflow-hidden text-center">
        
        {/* Top Glow Accent */}
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-500 to-emerald-500"></div>

        {/* Header */}
        <span className="bg-blue-500/10 text-blue-400 border border-blue-500/20 text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-widest inline-block mb-6">
          Official Support
        </span>
        <h1 className="text-3xl md:text-4xl font-black text-white mb-4">Get in Touch with Me 📞</h1>
        <p className="text-slate-400 text-sm md:text-base mb-10 leading-relaxed">
          If you have any questions regarding notes, payments, or courses, feel free to contact me directly via WhatsApp or Email.
        </p>

        {/* Contact Cards */}
        <div className="space-y-4">
          
          {/* WhatsApp Direct Chat Button */}
          <a 
            href={`https://wa.me/${whatsappNumber}?text=Hello%20Gopal,%20I%20need%20help%20regarding%20notes.`} 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-3 w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold p-4 rounded-2xl shadow-lg shadow-emerald-600/30 transition duration-200 text-base"
          >
            <span className="text-xl">💬</span> Chat on WhatsApp (+91 7017576551)
          </a>

          {/* Email Card */}
          <a 
            href={`mailto:${email}`}
            className="flex items-center justify-center gap-3 w-full bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 font-bold p-4 rounded-2xl transition duration-200 text-base"
          >
            <span className="text-xl">📧</span> {email}
          </a>

        </div>

        {/* Footer Note */}
        <p className="text-slate-500 text-xs mt-10">
          Available for student support and inquiries. Response time: Within 24 hours.
        </p>

      </div>
    </div>
  );
}

export default Contact;