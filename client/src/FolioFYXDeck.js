import React from 'react';
import { Page, Text, View, Document, StyleSheet, PDFDownloadLink } from '@react-pdf/renderer';

// 1. Define Styles (Dark Theme)
const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#121212', // Dark Background
    padding: 40,
  },
  section: {
    margin: 10,
    padding: 10,
    flexGrow: 1,
  },
  title: {
    fontSize: 34,
    color: 'white',
    fontFamily: 'Helvetica-Bold',
    marginBottom: 10,
    textAlign: 'center',
    marginTop: 100,
  },
  subtitle: {
    fontSize: 18,
    color: '#cccccc', // Light Grey
    textAlign: 'center',
    marginBottom: 50,
  },
  heading: {
    fontSize: 24,
    color: '#4D4DFF', // Vibrant Blue Accent
    marginBottom: 20,
    fontFamily: 'Helvetica-Bold',
  },
  text: {
    fontSize: 14,
    color: 'white',
    lineHeight: 1.5,
    marginBottom: 10,
    fontFamily: 'Helvetica',
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 40,
    right: 40,
    fontSize: 10,
    color: 'grey',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});

// 2. Create the PDF Document Component
const CapabilitiesDeck = () => (
  <Document>
    {/* --- Page 1: Cover --- */}
    <Page size="A4" orientation="landscape" style={styles.page}>
      <View style={styles.section}>
        <Text style={styles.title}>The FolioFYX</Text>
        <Text style={styles.subtitle}>Software Solutions to Grow Your Business</Text>
        <Text style={{...styles.text, textAlign: 'center', marginTop: 20}}>Capabilities Deck</Text>
      </View>
      <View style={styles.footer}>
        <Text>The FolioFYX</Text>
        <Text>www.foliofyx.com</Text>
      </View>
    </Page>

    {/* --- Page 2: Who We Are --- */}
    <Page size="A4" orientation="landscape" style={styles.page}>
      <View style={styles.section}>
        <Text style={styles.heading}>Who We Are</Text>
        <Text style={styles.text}>
          At The FolioFYX, we don't just build software; we engineer growth.
        </Text>
        <Text style={styles.text}>
          We are a premier digital agency focused on providing software solutions that scale your business operations. Our core philosophy is simple: functionality meets exceptional design.
        </Text>
        <Text style={styles.text}>
          We create the best UI. Our team translates complex business requirements into intuitive, beautiful, and high-performing user interfaces.
        </Text>
      </View>
      <View style={styles.footer}>
        <Text>The FolioFYX</Text>
        <Text>www.foliofyx.com</Text>
      </View>
    </Page>

    {/* --- Page 3: Services --- */}
    <Page size="A4" orientation="landscape" style={styles.page}>
      <View style={styles.section}>
        <Text style={styles.heading}>What We Do</Text>
        
        <View style={{ marginBottom: 15 }}>
            <Text style={{...styles.text, fontWeight: 'bold', color: '#4D4DFF'}}>01. UI/UX Design</Text>
            <Text style={styles.text}>We create the best UI in the industry. Research-backed and visually stunning.</Text>
        </View>

        <View style={{ marginBottom: 15 }}>
            <Text style={{...styles.text, fontWeight: 'bold', color: '#4D4DFF'}}>02. Software Solutions</Text>
            <Text style={styles.text}>Custom software development tailored to your specific business needs.</Text>
        </View>

        <View style={{ marginBottom: 15 }}>
            <Text style={{...styles.text, fontWeight: 'bold', color: '#4D4DFF'}}>03. Business Growth</Text>
            <Text style={styles.text}>Solutions designed to optimize conversion and efficiency.</Text>
        </View>
      </View>
      <View style={styles.footer}>
        <Text>The FolioFYX</Text>
        <Text>www.foliofyx.com</Text>
      </View>
    </Page>
  </Document>
);

// 3. The Download Button Component
const DownloadButton = () => (
  <div style={{ display: 'flex', justifyContent: 'center', marginTop: '50px' }}>
    <PDFDownloadLink document={<CapabilitiesDeck />} fileName="FolioFYX_Deck.pdf">
      {({ blob, url, loading, error }) =>
        loading ? (
          <button style={{ padding: '10px 20px', background: '#333', color: 'white' }}>
            Preparing Document...
          </button>
        ) : (
          <button style={{ padding: '10px 20px', background: '#4D4DFF', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontSize: '16px' }}>
            Download Capabilities Deck
          </button>
        )
      }
    </PDFDownloadLink>
  </div>
);

export default DownloadButton;