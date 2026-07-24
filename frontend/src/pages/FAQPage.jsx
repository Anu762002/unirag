import React, { useState } from 'react';
import { HelpCircle, ChevronDown, ChevronUp, Search, BookOpen, GraduationCap, DollarSign, Home, FileText } from 'lucide-react';

export const FAQPage = ({ onAskQuestion }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [openIdx, setOpenIdx] = useState(0);

  const categories = [
    {
      name: 'Academic & Attendance',
      icon: GraduationCap,
      faqs: [
        {
          q: 'What is the minimum attendance requirement for end-semester examinations?',
          a: 'Students are required to maintain a minimum of 75% attendance in all theory and practical courses registered in a semester to be eligible for end-semester exams. A relaxation of up to 10% may be granted on valid medical grounds by the Academic Dean.'
        },
        {
          q: 'What is the policy for medical leave attendance relaxation?',
          a: 'Medical relaxation requires official medical documentation submitted to the Academic Dean’s office within 7 days of returning to campus.'
        }
      ]
    },
    {
      name: 'Fee Payment & Financial Aid',
      icon: DollarSign,
      faqs: [
        {
          q: 'What are the tuition fee payment deadlines?',
          a: 'Semester tuition fees must be paid in full on or before August 15th for the Fall semester and January 15th for the Spring semester. Delayed payments incur a $50 late fee penalty per week.'
        },
        {
          q: 'What merit scholarships are available?',
          a: 'A 50% tuition waiver scholarship is awarded to students securing a CGPA of 9.0 or above at the end of each academic year.'
        }
      ]
    },
    {
      name: 'Hostel & Residential Policies',
      icon: Home,
      faqs: [
        {
          q: 'What are the hostel curfew hours on weekdays vs weekends?',
          a: 'Hostel curfew is 9:30 PM on weekdays (Monday to Friday) and 10:30 PM on weekends (Saturday and Sunday). Late entry requires prior written approval from the Chief Warden.'
        },
        {
          q: 'What are the visitor and guest entry rules?',
          a: 'Visitors and day scholars are permitted in the hostel common reception area between 4:00 PM and 7:00 PM only. Overnight guest stays in student rooms are strictly prohibited.'
        }
      ]
    },
    {
      name: 'Examinations & Evaluation',
      icon: FileText,
      faqs: [
        {
          q: 'What is the passing criteria for courses?',
          a: 'The minimum passing mark in any course is 40% combined across continuous internal assessments and end-semester examinations.'
        },
        {
          q: 'How can I apply for answer script re-evaluation?',
          a: 'Students may apply for re-evaluation or copy inspection within 15 days of result declaration. The application fee is $30 per course subject.'
        }
      ]
    }
  ];

  const filteredCategories = categories.map((cat) => ({
    ...cat,
    faqs: cat.faqs.filter(
      (f) =>
        f.q.toLowerCase().includes(searchTerm.toLowerCase()) ||
        f.a.toLowerCase().includes(searchTerm.toLowerCase())
    )
  })).filter((cat) => cat.faqs.length > 0);

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-8">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-slate-900 rounded-2xl p-8 text-white shadow-md">
        <div className="max-w-2xl space-y-3">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-white/10 text-blue-100 border border-white/20">
            <HelpCircle className="w-3.5 h-3.5" />
            Frequently Asked Questions
          </span>
          <h1 className="text-3xl font-extrabold tracking-tight">University Guidelines & FAQ</h1>
          <p className="text-sm text-blue-100/90 leading-relaxed">
            Find instant answers to common questions about attendance, fee deadlines, hostel curfews, exam re-evaluations, and scholarships.
          </p>
        </div>

        {/* Search Bar */}
        <div className="mt-6 relative max-w-xl">
          <Search className="w-4 h-4 text-slate-400 absolute left-4 top-3.5" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search FAQ by keyword (e.g. attendance, fee deadline, curfew)..."
            className="w-full pl-11 pr-4 py-3 bg-white text-slate-800 text-xs font-medium rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-slate-400"
          />
        </div>
      </div>

      {/* Accordion FAQ Groups */}
      <div className="space-y-6">
        {filteredCategories.map((cat, catIdx) => {
          const CategoryIcon = cat.icon;
          return (
            <div key={catIdx} className="bg-white rounded-2xl p-6 border border-slate-200 shadow-2xs space-y-4">
              <div className="flex items-center gap-2.5 border-b border-slate-100 pb-3">
                <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                  <CategoryIcon className="w-4 h-4" />
                </div>
                <h3 className="font-bold text-slate-800 text-sm">{cat.name}</h3>
              </div>

              <div className="space-y-3">
                {cat.faqs.map((faq, itemIdx) => {
                  const globalIdx = `${catIdx}-${itemIdx}`;
                  const isOpen = openIdx === globalIdx;
                  return (
                    <div
                      key={itemIdx}
                      className="border border-slate-200 rounded-xl overflow-hidden transition-colors"
                    >
                      <button
                        onClick={() => setOpenIdx(isOpen ? null : globalIdx)}
                        className="w-full text-left p-4 bg-slate-50/70 hover:bg-blue-50/50 flex items-center justify-between gap-3 text-xs font-bold text-slate-800 transition-colors"
                      >
                        <span className="leading-snug">{faq.q}</span>
                        {isOpen ? (
                          <ChevronUp className="w-4 h-4 text-blue-600 shrink-0" />
                        ) : (
                          <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
                        )}
                      </button>

                      {isOpen && (
                        <div className="p-4 bg-white text-xs text-slate-600 leading-relaxed border-t border-slate-100 space-y-3">
                          <p>{faq.a}</p>
                          <button
                            onClick={() => onAskQuestion(faq.q)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-50 text-blue-700 font-semibold text-[11px] hover:bg-blue-100 transition-colors"
                          >
                            <BookOpen className="w-3.5 h-3.5" />
                            <span>Ask Assistant for Document Citation</span>
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
