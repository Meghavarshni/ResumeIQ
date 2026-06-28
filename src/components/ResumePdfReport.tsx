import React from 'react';
import { 
  Document, 
  Page, 
  Text, 
  View, 
  StyleSheet, 
  Font 
} from '@react-pdf/renderer';
import type { AIAnalysisResponse, CandidateProfile } from '../types';

// Registry fonts for PDF
Font.register({
  family: 'Helvetica-Bold',
  src: 'https://fonts.gstatic.com/s/helveticaneue/v70/helt-bold.ttf' // Use built-in fallbacks if remote fails
});

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontFamily: 'Helvetica',
    fontSize: 10,
    color: '#334155',
    backgroundColor: '#ffffff',
  },
  coverPage: {
    padding: 50,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    height: '100%',
    backgroundColor: '#0f172a', // Premium dark slate theme
    color: '#ffffff',
  },
  coverTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#818cf8',
    marginBottom: 10,
    letterSpacing: -0.5,
  },
  coverSubtitle: {
    fontSize: 14,
    color: '#94a3b8',
    marginBottom: 40,
  },
  coverDivider: {
    height: 3,
    backgroundColor: '#6366f1',
    width: 80,
    marginBottom: 40,
  },
  metaRow: {
    display: 'flex',
    flexDirection: 'row',
    marginBottom: 15,
  },
  metaLabel: {
    width: 120,
    fontSize: 10,
    color: '#64748b',
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  metaValue: {
    fontSize: 11,
    color: '#e2e8f0',
  },
  section: {
    marginBottom: 20,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1e3a8a',
    marginBottom: 10,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  grid: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 15,
  },
  col: {
    flex: 1,
    padding: 10,
    marginRight: 10,
    backgroundColor: '#f8fafc',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  scoreHeader: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#4f46e5',
    textAlign: 'center',
    marginBottom: 4,
  },
  scoreLabel: {
    fontSize: 9,
    color: '#64748b',
    textAlign: 'center',
    textTransform: 'uppercase',
  },
  bulletList: {
    marginLeft: 10,
    marginBottom: 10,
  },
  bulletItem: {
    display: 'flex',
    flexDirection: 'row',
    marginBottom: 5,
  },
  bulletDot: {
    width: 10,
    color: '#4f46e5',
  },
  bulletText: {
    flex: 1,
    lineHeight: 1.4,
  },
  badgeContainer: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 5,
  },
  badge: {
    backgroundColor: '#eff6ff',
    color: '#1e40af',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
    fontSize: 8,
    marginRight: 6,
    marginBottom: 6,
    borderWidth: 1,
    borderColor: '#dbeafe',
  },
  dangerBadge: {
    backgroundColor: '#fef2f2',
    color: '#991b1b',
    borderColor: '#fee2e2',
  },
  verdictContainer: {
    padding: 15,
    borderRadius: 10,
    backgroundColor: '#e0e7ff',
    borderLeftWidth: 4,
    borderLeftColor: '#4f46e5',
    marginBottom: 15,
  },
  verdictTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#1e1b4b',
    marginBottom: 4,
  },
  verdictText: {
    fontSize: 10,
    lineHeight: 1.4,
    color: '#312e81',
  },
  footer: {
    position: 'absolute',
    bottom: 25,
    left: 40,
    right: 40,
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
    paddingTop: 10,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    fontSize: 8,
    color: '#94a3b8',
  }
});

interface ResumePdfReportProps {
  candidateInfo: CandidateProfile | null;
  resumeFileName: string;
  atsScore: number;
  aiAnalysis: AIAnalysisResponse;
  timestamp: string;
}

export const ResumePdfReport: React.FC<ResumePdfReportProps> = ({
  candidateInfo,
  resumeFileName,
  atsScore,
  aiAnalysis,
  timestamp,
}) => {
  return (
    <Document>
      {/* PAGE 1: COVER PAGE */}
      <Page size="A4" style={styles.coverPage}>
        <View>
          <Text style={styles.coverTitle}>ResumeIQ Match Report</Text>
          <Text style={styles.coverSubtitle}>Automated Recruiter Diagnostic & ATS Evaluation</Text>
          <View style={styles.coverDivider} />
        </View>

        <View style={{ marginTop: 20 }}>
          <View style={styles.metaRow}>
            <Text style={styles.metaLabel}>Candidate Name</Text>
            <Text style={styles.metaValue}>{candidateInfo?.name || 'Not Provided'}</Text>
          </View>
          <View style={styles.metaRow}>
            <Text style={styles.metaLabel}>Email Address</Text>
            <Text style={styles.metaValue}>{candidateInfo?.email || 'Not Provided'}</Text>
          </View>
          <View style={styles.metaRow}>
            <Text style={styles.metaLabel}>Analyzed File</Text>
            <Text style={styles.metaValue}>{resumeFileName}</Text>
          </View>
          <View style={styles.metaRow}>
            <Text style={styles.metaLabel}>Report Date</Text>
            <Text style={styles.metaValue}>{timestamp}</Text>
          </View>
          <View style={styles.metaRow}>
            <Text style={styles.metaLabel}>Status</Text>
            <Text style={[styles.metaValue, { color: '#34d399', fontWeight: 'bold' }]}>COMPLETED (LOCAL_STORAGE_SAVED)</Text>
          </View>
        </View>

        <View style={styles.footer}>
          <Text>© 2026 ResumeIQ. Optimize. Match. Get Hired.</Text>
          <Text>Confidential Report</Text>
        </View>
      </Page>

      {/* PAGE 2: DIAGNOSTICS & SUMMARY */}
      <Page size="A4" style={styles.page}>
        {/* Core Scores */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Executive Metrics</Text>
          <View style={styles.grid}>
            <View style={styles.col}>
              <Text style={styles.scoreHeader}>{atsScore}/100</Text>
              <Text style={styles.scoreLabel}>ATS Format Score</Text>
            </View>
            <View style={styles.col}>
              <Text style={styles.scoreHeader}>{aiAnalysis.job_match_score}/100</Text>
              <Text style={styles.scoreLabel}>Role Compatibility</Text>
            </View>
            <View style={styles.col}>
              <Text style={styles.scoreHeader}>{aiAnalysis.hiring_probability}%</Text>
              <Text style={styles.scoreLabel}>Hiring Probability</Text>
            </View>
            <View style={[styles.col, { marginRight: 0 }]}>
              <Text style={[styles.scoreHeader, { color: '#059669' }]}>{aiAnalysis.hiring_readiness}</Text>
              <Text style={styles.scoreLabel}>Hiring Readiness</Text>
            </View>
          </View>

          {/* Final Verdict Callout */}
          <View style={styles.verdictContainer}>
            <Text style={styles.verdictTitle}>Recruiter Verdict: {aiAnalysis.final_verdict}</Text>
            <Text style={styles.verdictText}>{aiAnalysis.summary}</Text>
          </View>
        </View>

        {/* Missing Target Skills */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Required Skills Deficit</Text>
          <Text style={{ marginBottom: 8, lineHeight: 1.3 }}>
            The following essential technologies and frameworks were missing or lacked detail in the parsed resume:
          </Text>
          <View style={styles.badgeContainer}>
            {aiAnalysis.missing_skills.length > 0 ? (
              aiAnalysis.missing_skills.map((skill) => (
                <View key={skill} style={[styles.badge, styles.dangerBadge]}>
                  <Text>{skill}</Text>
                </View>
              ))
            ) : (
              <Text style={{ fontSize: 9, fontStyle: 'italic', color: '#64748b' }}>No skills deficits detected. Fully aligned.</Text>
            )}
          </View>
        </View>

        {/* Keyword Gaps */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>ATS Vocabulary Gaps</Text>
          <View style={styles.badgeContainer}>
            {aiAnalysis.keyword_gaps.length > 0 ? (
              aiAnalysis.keyword_gaps.map((item) => (
                <View key={item.keyword} style={styles.badge}>
                  <Text>{item.keyword} ({item.importance} Priority)</Text>
                </View>
              ))
            ) : (
              <Text style={{ fontSize: 9, fontStyle: 'italic', color: '#64748b' }}>Vocabulary matches targets correctly.</Text>
            )}
          </View>
        </View>

        <View style={styles.footer}>
          <Text>ResumeIQ Analysis Report • {candidateInfo?.name || 'Report'}</Text>
          <Text>Page 2</Text>
        </View>
      </Page>

      {/* PAGE 3: RECOMMENDATIONS & ACTIONS */}
      <Page size="A4" style={styles.page}>
        {/* Strengths */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Candidate Strengths</Text>
          <View style={styles.bulletList}>
            {aiAnalysis.strengths.map((str, idx) => (
              <View key={idx} style={styles.bulletItem}>
                <Text style={styles.bulletDot}>•</Text>
                <Text style={styles.bulletText}>
                  <Text style={{ fontWeight: 'bold', color: '#1e293b' }}>{str.title}: </Text>
                  {str.explanation}
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* Weaknesses */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Flagged Weaknesses & Fixes</Text>
          <View style={styles.bulletList}>
            {aiAnalysis.weaknesses.map((weak, idx) => (
              <View key={idx} style={styles.bulletItem} wrap={false}>
                <Text style={styles.bulletDot}>•</Text>
                <Text style={styles.bulletText}>
                  <Text style={{ fontWeight: 'bold', color: '#b91c1c' }}>{weak.issue}: </Text>
                  {weak.impact} {'\n'}
                  <Text style={{ color: '#4f46e5', fontSize: 9 }}>Correction: {weak.suggestion}</Text>
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* Action roadmap */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Actionable Roadmap</Text>
          <View style={styles.bulletList}>
            {aiAnalysis.improvement_suggestions.map((rec, idx) => (
              <View key={idx} style={styles.bulletItem} wrap={false}>
                <Text style={styles.bulletDot}>•</Text>
                <Text style={styles.bulletText}>
                  <Text style={{ fontWeight: 'bold', color: '#1e3a8a' }}>[{rec.priority}] {rec.reason}: </Text>
                  {rec.action} ({rec.impact})
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* Layout recommendations */}
        {aiAnalysis.ats_suggestions.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Layout & ATS Formatting recommendations</Text>
            <View style={styles.bulletList}>
              {aiAnalysis.ats_suggestions.map((sug, idx) => (
                <View key={idx} style={styles.bulletItem}>
                  <Text style={styles.bulletDot}>•</Text>
                  <Text style={styles.bulletText}>{sug}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        <View style={styles.footer}>
          <Text>ResumeIQ Analysis Report • {candidateInfo?.name || 'Report'}</Text>
          <Text>Page 3</Text>
        </View>
      </Page>
    </Document>
  );
};
export default ResumePdfReport;
