import React from 'react';
import { 
  Document, 
  Page, 
  Text, 
  View, 
  StyleSheet 
} from '@react-pdf/renderer';
import type { OptimizedResumeResponse } from '../types';

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontFamily: 'Helvetica',
    fontSize: 10,
    color: '#1e293b', // Clean dark slate text
    backgroundColor: '#ffffff',
    lineHeight: 1.4,
  },
  header: {
    textAlign: 'center',
    marginBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#cbd5e1',
    paddingBottom: 8,
  },
  name: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#0f172a',
    letterSpacing: -0.5,
    marginBottom: 4,
  },
  contactRow: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    flexWrap: 'wrap',
    fontSize: 8.5,
    color: '#475569',
  },
  contactItem: {
    marginHorizontal: 6,
  },
  section: {
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#0f172a',
    textTransform: 'uppercase',
    borderBottomWidth: 0.75,
    borderBottomColor: '#64748b',
    paddingBottom: 2,
    marginBottom: 6,
    letterSpacing: 0.5,
  },
  summaryText: {
    fontSize: 9.5,
    color: '#334155',
    textAlign: 'justify',
  },
  skillsContainer: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  skillText: {
    fontSize: 9,
    marginRight: 10,
    marginBottom: 4,
    color: '#334155',
  },
  itemHeader: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    fontWeight: 'bold',
    color: '#0f172a',
    fontSize: 9.5,
    marginBottom: 3,
  },
  itemSubHeader: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    fontSize: 9,
    color: '#475569',
    marginBottom: 4,
    fontStyle: 'italic',
  },
  bulletList: {
    marginLeft: 8,
    marginBottom: 8,
  },
  bulletItem: {
    display: 'flex',
    flexDirection: 'row',
    marginBottom: 3,
  },
  bulletDot: {
    width: 8,
    color: '#0f172a',
    fontSize: 8,
  },
  bulletText: {
    flex: 1,
    fontSize: 9,
    color: '#334155',
  },
});

interface OptimizedResumePdfProps {
  resumeData: OptimizedResumeResponse;
}

export const OptimizedResumePdf: React.FC<OptimizedResumePdfProps> = ({ resumeData }) => {
  const {
    header,
    professional_summary,
    skills,
    experience,
    education,
    projects,
    certifications,
    achievements,
  } = resumeData;

  // Render contacts details inline
  const contactDetails = [
    header.email,
    header.phone,
    header.linkedin,
    header.github,
    header.portfolio,
  ].filter(Boolean);

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        
        {/* HEADER SECTION */}
        <View style={styles.header}>
          <Text style={styles.name}>{header.name}</Text>
          <View style={styles.contactRow}>
            {contactDetails.map((contact, idx) => (
              <Text key={idx} style={styles.contactItem}>
                {contact} {idx < contactDetails.length - 1 ? ' | ' : ''}
              </Text>
            ))}
          </View>
        </View>

        {/* SUMMARY SECTION */}
        {professional_summary && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Professional Summary</Text>
            <Text style={styles.summaryText}>{professional_summary}</Text>
          </View>
        )}

        {/* SKILLS SECTION */}
        {skills && skills.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Core Competencies</Text>
            <View style={styles.skillsContainer}>
              <Text style={styles.skillText}>
                {skills.join(' • ')}
              </Text>
            </View>
          </View>
        )}

        {/* EXPERIENCE SECTION */}
        {experience && experience.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Professional Experience</Text>
            {experience.map((exp, idx) => (
              <View key={idx} style={{ marginBottom: 8 }} wrap={false}>
                <View style={styles.itemHeader}>
                  <Text style={{ fontWeight: 'bold' }}>{exp.role}</Text>
                  <Text style={{ fontSize: 9 }}>{exp.duration}</Text>
                </View>
                <View style={styles.itemSubHeader}>
                  <Text>{exp.company}</Text>
                </View>
                <View style={styles.bulletList}>
                  {exp.bullet_points.map((bullet, bIdx) => (
                    <View key={bIdx} style={styles.bulletItem}>
                      <Text style={styles.bulletDot}>•</Text>
                      <Text style={styles.bulletText}>{bullet}</Text>
                    </View>
                  ))}
                </View>
              </View>
            ))}
          </View>
        )}

        {/* PROJECTS SECTION */}
        {projects && projects.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Key Projects</Text>
            {projects.map((proj, idx) => (
              <View key={idx} style={{ marginBottom: 6 }} wrap={false}>
                <View style={styles.itemHeader}>
                  <Text style={{ fontWeight: 'bold' }}>{proj.title}</Text>
                  <Text style={{ fontSize: 8.5, color: '#475569' }}>
                    [{proj.technologies.join(', ')}]
                  </Text>
                </View>
                <View style={styles.bulletList}>
                  {proj.bullet_points.map((bullet, bIdx) => (
                    <View key={bIdx} style={styles.bulletItem}>
                      <Text style={styles.bulletDot}>•</Text>
                      <Text style={styles.bulletText}>{bullet}</Text>
                    </View>
                  ))}
                </View>
              </View>
            ))}
          </View>
        )}

        {/* EDUCATION SECTION */}
        {education && education.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Education</Text>
            {education.map((edu, idx) => (
              <View key={idx} style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 }} wrap={false}>
                <Text style={{ fontWeight: 'bold' }}>
                  {edu.degree} - <Text style={{ fontStyle: 'italic', fontWeight: 'normal' }}>{edu.institution}</Text>
                </Text>
                <Text>{edu.year}</Text>
              </View>
            ))}
          </View>
        )}

        {/* CERTIFICATIONS SECTION */}
        {certifications && certifications.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Certifications & Training</Text>
            <View style={styles.bulletList}>
              {certifications.map((cert, idx) => (
                <View key={idx} style={styles.bulletItem}>
                  <Text style={styles.bulletDot}>•</Text>
                  <Text style={styles.bulletText}>{cert}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* ACHIEVEMENTS SECTION */}
        {achievements && achievements.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Key Achievements</Text>
            <View style={styles.bulletList}>
              {achievements.map((ach, idx) => (
                <View key={idx} style={styles.bulletItem}>
                  <Text style={styles.bulletDot}>•</Text>
                  <Text style={styles.bulletText}>{ach}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

      </Page>
    </Document>
  );
};
export default OptimizedResumePdf;
