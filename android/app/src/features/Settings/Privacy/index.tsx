import React from 'react';
import { ScrollView, View, Text, StyleSheet } from 'react-native';

const Privacy = () => {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Privacy Policy</Text>

        <Text style={styles.sectionTitle}>1. Introduction</Text>
        <Text style={styles.text}>
          We respect your privacy and are committed to protecting your personal information. 
          This privacy policy explains how we collect, use, disclose, and protect your information.
        </Text>

        <Text style={styles.sectionTitle}>2. Information We Collect</Text>
        <Text style={styles.text}>
          We may collect information about you in various ways, including but not limited to:
        </Text>
        <Text style={styles.text}>
          - Personal information you provide directly (e.g., name, email address) when using our app.
        </Text>
        <Text style={styles.text}>
          - Usage data collected automatically (e.g., information about your device, IP address).
        </Text>

        <Text style={styles.sectionTitle}>3. Use of Your Information</Text>
        <Text style={styles.text}>
          We use the information we collect for:
        </Text>
        <Text style={styles.text}>
          - Providing and managing our application.
          - Improving our application and personalizing the user experience.
          - Communicating with you regarding your use of our application.
        </Text>

        <Text style={styles.sectionTitle}>4. Sharing Your Information</Text>
        <Text style={styles.text}>
          We do not share your personal information with third parties, except as necessary 
          to provide our services or as required by law.
        </Text>

        <Text style={styles.sectionTitle}>5. Security of Your Information</Text>
        <Text style={styles.text}>
          We take reasonable measures to protect your personal information. However, 
          no method of transmission over the Internet or method of electronic storage is 100% 
          secure.
        </Text>

        <Text style={styles.sectionTitle}>6. Your Rights</Text>
        <Text style={styles.text}>
          You have the right to access your personal information, correct it, or request its 
          deletion. If you have any questions regarding your rights, please contact us.
        </Text>

        <Text style={styles.sectionTitle}>7. Changes to This Policy</Text>
        <Text style={styles.text}>
          We may update this privacy policy from time to time. We will notify you of changes 
          by posting the new policy on this page.
        </Text>

        <Text style={styles.sectionTitle}>8. Contact</Text>
        <Text style={styles.text}>
          If you have any questions or concerns regarding this privacy policy, please contact us at [your email address].
        </Text>

        <Text style={styles.footer}>
          Last updated: [update date]
        </Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#c7f0d8',
    padding: 20,
  },
  content: {
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#43523d',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 10,
    color: '#000000',
  },
  text: {
    fontSize: 16,
    marginVertical: 5,
    lineHeight: 24,
    color: '#000000',
  },
  footer: {
    marginTop: 20,
    fontSize: 14,
    textAlign: 'center',
    color: '#000000',
  },
});

export default Privacy;
