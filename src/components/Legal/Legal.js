import React, { Component } from "react";
import {
  Container,
  Accordion,
  Icon,
  Header,
  Grid,
  Segment,
  Responsive,
  Divider
} from "semantic-ui-react";

import "./Legal.css";
import translate from "../../i18n/translate";
import DiginetAML from "../../common/Diginet WORD AML.pdf";
import curriculum from "../../common/Diginet LLC Curriculum.pdf";
import certificate from "../../common/Certificate of Organization Diginet Llc.pdf";
import { isMobile } from "react-device-detect";
class Legal extends Component {
  constructor(props) {
    super(props);
    this.state = { activeIndex: 0, translator: props.translate };
  }

  handleClick = (e, titleProps) => {
    const { index } = titleProps;
    const { activeIndex } = this.state;
    const newIndex = activeIndex === index ? -1 : index;

    this.setState({ activeIndex: newIndex });
  };
  componentDidMount() {
    this.setState({
      translator: this.props.translate
    });
  }

  componentWillReceiveProps(nextProps, nextContext) {
    if (this.props.language !== nextProps.language) {
      this.setState({
        translator: nextProps.translate
      });
    }
  }
  render() {
    let t = this.state.translator;
    const { activeIndex } = this.state;
    const aml = (
      <div>
        <h5 className="legal-content">1. Firm Policy</h5>
        <p className="legal-content">
          It is the policy of the firm to prohibit and actively prevent money
          laundering and any activity that facilitates money laundering or the
          funding of terrorist or criminal activities by complying with all
          applicable requirements under the Bank Secrecy Act (BSA) and its
          implementing regulations.
          <br />
          <br />
          Money laundering is generally defined as engaging in acts designed to
          conceal or disguise the true origins of criminally derived proceeds so
          that the proceeds appear to have derived from legitimate origins or
          constitute legitimate assets. Generally, money laundering occurs in
          three stages. Cash first enters the financial system at the
          "placement" stage, where the cash generated from criminal activities
          is converted into monetary instruments, such as money orders or
          traveler's checks, or deposited into accounts at financial
          institutions. At the "layering" stage, the funds are transferred or
          moved into other accounts or other financial institutions to further
          separate the money from its criminal origin. At the "integration"
          stage, the funds are reintroduced into the economy and used to
          purchase legitimate assets or to fund other criminal activities or
          legitimate businesses.
          <br />
          <br />
          Although cash is rarely deposited into securities accounts, the
          securities industry is unique in that it can be used to launder funds
          obtained elsewhere, and to generate illicit funds within the industry
          itself through fraudulent activities. Examples of types of fraudulent
          activities include insider trading, market manipulation, ponzi
          schemes, cybercrime and other investment-related fraudulent activity.
          <br />
          <br />
          Terrorist financing may not involve the proceeds of criminal conduct,
          but rather an attempt to conceal either the origin of the funds or
          their intended use, which could be for criminal purposes. Legitimate
          sources of funds are a key difference between terrorist financiers and
          traditional criminal organizations. In addition to charitable
          donations, legitimate sources include foreign government sponsors,
          business ownership and personal employment. Although the motivation
          differs between traditional money launderers and 1terrorist
          financiers, the actual methods used to fund terrorist operations can
          be the same as or similar to methods used by other criminals to
          launder funds. Funding for terrorist attacks does not always require
          large sums of money and the associated transactions may not be
          complex.
          <br />
          <br />
          Our AML policies, procedures and internal controls are designed to
          ensure compliance with all applicable BSA regulations and FINRA rules
          and will be reviewed and updated on a regular basis to ensure
          appropriate policies, procedures and internal controls are in place to
          account for both changes in regulations and changes in our business.
        </p>
        <h5 className="legal-content">
          2. AML Compliance Person Designation and Duties
        </h5>
        <p className="legal-content">
          The firm has designated Miguel Torres as its Anti-Money Laundering
          Program Compliance Person (AML Compliance Person), with full
          responsibility for the firm’s AML program. The duties of the AML
          Compliance Person will include monitoring the firm’s compliance with
          AML obligations, overseeing communication and training for employees,
          and file any required reporting forms to FINCEN or the other
          applicable government agencies as required under the rules for MSB.
          The AML Compliance Person will also ensure that the firm keeps and
          maintains all of the required AML records and will ensure that
          Suspicious Activity Reports (SARs) are filed with the Financial Crimes
          Enforcement Network (FinCEN) when appropriate. The AML Compliance
          Person is vested with full responsibility and authority to enforce the
          firm’s AML program.
          <br />
          <br />
          The firm will provide FINRA with contact information for the AML
          Compliance Person through the FINRA Contact System (FCS), including:
          (1) name; (2) title; (3) mailing address; (4) email address; (5)
          telephone number; and (6) facsimile (if any). The firm will promptly
          notify FINRA of any change in this information through FCS and will
          review, and if necessary update, this information within 17 business
          days after the end of each calendar year. The annual review of FCS
          information will be conducted by Torres and will be completed with all
          necessary updates being provided no later than 17 business days
          following the end of each calendar year. In addition, if there is any
          change to the information, Torres will update the information
          promptly, but in any event not later than 30 days following the
          change.
        </p>
        <h4 className="legal-content">
          3. Giving AML Information to Federal Law Enforcement Agencies and
          Other Financial Institutions
        </h4>
        <h5 className="bleeding">
          a. FinCEN Requests Under USA PATRIOT Act Section 314(a)
        </h5>
        <p className="legal-content">
          Pursuant to the BSA and its implementing regulations, financial
          institutions are required to make certain searches of their records
          upon receiving an information request from FinCEN. Describe your
          firm’s procedures for FinCEN requests for information on money
          laundering or terrorist activity.
          <br />
          <br />
          In order for a firm to obtain information requests from FinCEN, the
          firm must first designate an AML Contact Person in FCS. You should be
          aware that if you want to change the person who receives FinCEN
          requests, you must change the AML contact information in FCS. When you
          are faced with a change in personnel who will receive this
          information, you should be aware that FinCEN receives a data feed of
          this revised information from FCS every other week and that it may
          take several weeks for a firm’s new AML contact person to receive
          information from FinCEN. Therefore, it is advisable for a firm that is
          aware that a person who had been receiving FinCEN requests is leaving
          the firm to change the information on FCS as soon as practical to
          ensure continuity of receiving FinCEN information.
          <br />
          <br />
          We will respond to a Financial Crimes Enforcement Network (FinCEN)
          request concerning accounts and transactions (a 314(a) Request) by
          immediately searching our records to determine whether we maintain or
          have maintained any account for, or have engaged in any transaction
          with, each individual, entity or organization named in the 314(a)
          Request as outlined in the Frequently Asked Questions (FAQ) located on
          FinCEN’s secure website. We understand that we have 14 days (unless
          otherwise specified by FinCEN) from the transmission date of the
          request to respond to a 314(a) Request. We will designate through the
          FINRA Contact System (FCS) one or more persons to be the point of
          contact (POC) for 314(a) Requests and will promptly update the POC
          information following any change in such information. (See also
          Section 2 above regarding updating of contact information for the AML
          Compliance Person.) Unless otherwise stated in the 314(a) Request or
          specified by FinCEN, we are required to search those documents
          outlined in FinCEN’s FAQ. If we find a match, Torres will report it to
          FinCEN via FinCEN’s Web-based 314(a) Secure Information Sharing System
          within 14 days or within the time requested by FinCEN in the request.
          If the search parameters differ from those mentioned above (for
          example, if FinCEN limits the search to a geographic location), Torres
          will structure our search accordingly.
          <br />
          <br />
          If Torres searches our records and does not find a matching account or
          transaction, then Torres will not reply to the 314(a) Request. We will
          maintain documentation that we have performed the required search We
          will not disclose the fact that FinCEN has requested or obtained
          information from us, except to the extent necessary to comply with the
          information request. Torres will review, maintain and implement
          procedures to protect the security and confidentiality of requests
          from FinCEN similar to those procedures established to satisfy the
          requirements of Section 501 of the Gramm-Leach-Bliley Act with regard
          to the protection of customers’ nonpublic information.
          <br />
          <br />
          We will direct any questions we have about the 314(a) Request to the
          requesting federal law enforcement agency as designated in the
          request.
          <br />
          <br />
          3Unless otherwise stated in the 314(a) Request, we will not be
          required to treat the information request as continuing in nature, and
          we will not be required to treat the periodic 314(a) Requests as a
          government provided list of suspected terrorists for purposes of the
          customer identification and verification requirements.
        </p>

        <h5 className="bleeding">b. National Security Letters</h5>
        <p className="legal-content">
          National Security Letters (NSLs) are written investigative demands
          that may be issued by the local Federal Bureau of Investigation (FBI)
          and other federal government authorities conducting
          counterintelligence and counterterrorism investigations to obtain,
          among other things, financial records of broker-dealers. NSLs are
          highly confidential. No broker-dealer, officer, employee or agent of
          the broker-dealer can disclose to any person that a government
          authority or the FBI has sought or obtained access to records. Firms
          that receive NSLs must have policies and procedures in place for
          processing and maintaining the confidentiality of NSLs. If you file a
          Suspicious Activity Report (SAR) after receiving a NSL, the SAR should
          not contain any reference to the receipt or existence of the NSL.
          <br />
          <br />
          We understand that the receipt of a National Security Letter (NSL) is
          highly confidential. We understand that none of our officers,
          employees or agents may directly or indirectly disclose to any person
          that the FBI or other federal government authority has sought or
          obtained access to any of our records. To maintain the confidentiality
          of any NSL we receive, we will process and maintain the NSL in person
          and limit communication to only those in the organization required. If
          we file a SAR after receiving an NSL, the SAR will not contain any
          reference to the receipt or existence of the NSL. The SAR will only
          contain detailed information about the facts and circumstances of the
          detected suspicious activity.
        </p>
        <h5 className="bleeding">c. Grand Jury Subpoenas</h5>
        <p className="legal-content">
          Grand juries may issue subpoenas as part of their investigative
          proceedings. The receipt of a grand jury subpoena does not in itself
          require the filing of a Suspicious Activity Report (SAR). However,
          broker-dealers should conduct a risk assessment of the customer who is
          the subject of the grand jury subpoena, as well as review the
          customer’s account activity. If suspicious activity is uncovered
          during this review, broker-dealers should consider elevating the risk
          profile of the customer and file a SAR in accordance with the SAR
          filing requirements. Grand jury proceedings are confidential, and a
          broker-dealer that receives a subpoena is prohibited from directly or
          indirectly notifying the person who is the subject of the
          investigation about the existence of the grand jury subpoena, its
          contents or the information used to reply to it. If you file a SAR
          after receiving a grand jury subpoena, the SAR should not contain any
          reference to the receipt or existence of it. The SAR should provide
          detailed information about the facts and circumstances of the detected
          suspicious activity.
          <br />
          <br />
          We understand that the receipt of a grand jury subpoena concerning a
          customer does not in itself require that we file a Suspicious Activity
          Report (SAR). When we receive a grand jury subpoena, we will conduct a
          risk assessment of the customer subject to the subpoena as well as
          review the customer’s account activity. If we uncover suspicious
          activity during our risk assessment and review, we will elevate that
          customer’s risk assessment and file a SAR in accordance with the SAR
          filing requirements. We understand that none of our officers,
          employees or agents may directly or indirectly disclose to the person
          who is the subject of the subpoena its existence, its contents or the
          information we used to respond to it. If we file a SAR after receiving
          a grand jury subpoena, the SAR will not contain any reference to the
          receipt or existence of the subpoena. The SAR will only contain
          detailed information about the facts and circumstances of the detected
          suspicious activity.
        </p>
        <h5 className="bleeding">
          d. Voluntary Information Sharing With Other Financial Institutions
          Under USA PATRIOT Act Section 314(b)
        </h5>
        <p className="legal-content">
          BSA regulations permit financial institutions to share information
          with other financial institutions under the protection of a safe
          harbor if certain procedures are followed. If your firm shares or
          plans to share information with other financial institutions, describe
          your firm's procedures for such sharing.
          <br />
          <br />
          We will share information with other financial institutions regarding
          individuals, entities, organizations and countries for purposes of
          identifying and, where appropriate, reporting activities that we
          suspect may involve possible terrorist activity or money laundering.
          Torres will ensure that the firm files with FinCEN an initial notice
          before any sharing occurs and annual notices thereafter. We will use
          the notice form found at FinCEN’s website. Before we share information
          with another financial institution, we will take reasonable steps to
          verify that the other financial institution has submitted the
          requisite notice to FinCEN, either by obtaining confirmation from the
          financial institution or by consulting a list of such financial
          institutions that FinCEN will make available. We understand that this
          requirement applies even to financial institutions with which we are
          affiliated, and that we will obtain the requisite notices from
          affiliates and follow all required procedures.
          <br />
          <br />
          We will employ strict procedures both to ensure that only relevant
          information is shared and to protect the security and confidentiality
          of this information, for example, by segregating it from the firm’s
          other books and records.
          <br />
          <br />
          We also will employ procedures to ensure that any information received
          from another financial institution shall not be used for any purpose
          other than:
          <br />
          <br />
          • identifying and, where appropriate, reporting on money laundering or
          terrorist activities;
          <br />
          <br />
          • determining whether to establish or maintain an account, or to
          engage in a transaction; or
          <br />
          <br />• assisting the financial institution in complying with
          performing such activities.
        </p>
        <h5 className="bleeding">
          e. Joint Filing of SARs by Broker-Dealers and Other Financial
          Institutions
        </h5>
        <p className="legal-content">
          The obligation to identify and properly report a suspicious
          transaction and to timely file a SAR rests separately with each
          broker-dealer. However, one SAR may be filed for a suspicious activity
          by all broker-dealers involved in a transaction (so long as the report
          filed contains all relevant and required information) if the SAR is
          jointly filed. In addition, if a broker-dealer and another financial
          institution that is subject to the SAR regulations are involved in the
          same suspicious transaction, the financial institution may also file a
          SAR jointly (so long as the report filed contains all relevant and
          required information). For example, a broker-dealer and an insurance
          company may file one SAR with respect to suspicious activity involving
          the sale of variable insurance products. Disclosures that are made for
          the purposes of jointly filing a SAR are protected by the safe harbor
          contained in the SAR regulations. The financial institutions that
          jointly file a SAR shall each be separately responsible for
          maintaining a copy of the SAR and should maintain their own SAR
          supporting documentation in accordance with BSA recordkeeping
          requirements. See generally Section 12 (Suspicious Transaction and BSA
          Reporting) for information on a broker-dealer’s obligation to file a
          SAR to report suspicious transactions.
          <br />
          <br />
          We will file joint SARs in the following circumstances, and will also
          share information about a particular suspicious transaction with any
          broker-dealer, as appropriate, involved in that particular transaction
          for purposes of determining whether we will file jointly a SAR.
          <br />
          <br />
          We will share information about particular suspicious transactions
          with our clearing broker for purposes of determining whether we and
          our clearing broker will file jointly a SAR. In cases in which we file
          a joint SAR for a transaction that has been handled both by us and by
          the clearing broker, we may share with the clearing broker a copy of
          the filed SAR.
          <br />
          <br />
          If we determine it is appropriate to jointly file a SAR, we understand
          that we cannot disclose that we have filed a SAR to any financial
          institution except the financial institution that is filing jointly.
          If we determine it is not appropriate to file jointly (e.g., because
          the SAR concerns the other broker-dealer or one of its employees), we
          understand that we cannot disclose that we have filed a SAR to any
          other financial institution or insurance company.
        </p>
        <h5 className="legal-content">
          4. Checking the Office of Foreign Assets Control Listings
        </h5>
        <p className="legal-content">
          Although not part of the BSA and its implementing regulations, the
          Office of Foreign Assets Control (OFAC) compliance is often performed
          in conjunction with AML compliance. OFAC is an office of the U.S.
          Treasury that administers and enforces economic sanctions and
          embargoes based on U.S. foreign policy and national security goals
          that target geographic regions and governments (e.g., Cuba, Sudan and
          Syria), as well as individuals or entities that could be anywhere
          (e.g., international narcotics traffickers, foreign terrorists and
          proliferators of weapons of mass destruction). As part of its
          enforcement efforts, OFAC publishes a list of Specially Designated
          Nationals and Blocked Persons (SDN list), which includes names of
          companies and individuals who are connected with the sanctions
          targets. U.S. persons are prohibited from dealing with SDNs wherever
          they are located, and all SDN assets must be blocked. Because OFAC's
          programs are constantly changing, describe how you will check with
          OFAC to ensure that your SDN list is current and also that you have
          complete information regarding the listings of economic sanctions and
          embargoes enforced by OFAC affecting countries and parties before
          opening an account and for existing accounts.
          <br />
          <br />
          Before opening an account, and on an ongoing basis, Torres will check
          to ensure that a customer does not appear on the SDN list or is not
          engaging in transactions that are prohibited by the economic sanctions
          and embargoes administered and enforced by OFAC. (See the OFAC website
          for the SDN list and listings of current sanctions and embargoes).
          Because the SDN list and listings of economic sanctions and embargoes
          are updated frequently, we will consult them on a regular basis and
          subscribe to receive any available updates when they occur. With
          respect to the SDN list, we may also access that list through various
          software programs to ensure speed and accuracy. See also FINRA’s OFAC
          Search Tool that screens names against the SDN list. Torres will also
          review existing accounts against the SDN list and listings of current
          sanctions and embargoes when they are updated and [he or she] will
          document the review.
          <br />
          <br />
          If we determine that a customer is on the SDN list or is engaging in
          transactions that are prohibited by the economic sanctions and
          embargoes administered and enforced by OFAC, we will reject the
          transaction and/or block the customer's assets and file a blocked
          assets and/or rejected transaction form with OFAC within 10 days. We
          will also call the OFAC Hotline at (800) 540-6322 immediately.
          <br />
          <br />
          Our review will include customer accounts, transactions involving
          customers (including activity that passes through the firm such as
          wires) and the review of customer transactions that involve physical
          security certificates or application-based investments (e.g., mutual
          funds).
        </p>
        <h5 className="legal-content">5. Customer Identification Program</h5>
        <p className="legal-content">
          We do not open or maintain customer accounts within the meaning of 31
          CFR 1023.100, in that we do not establish formal relationships with
          “customers” for the purpose of effecting transactions in securities.
          If in the future the firm elects to open customer accounts or to
          establish formal relationships with customers for the purpose of
          effecting transactions in securities, we will first establish,
          document and ensure the implementation of appropriate CIP procedures.
          (Note that a change in the firm’s business to accept customer accounts
          may be a material change in business requiring an application, review
          and approval by FINRA. See NASD Rule 1017).
        </p>
        <h5 className="bleeding">a. Required Customer Information</h5>
        <p className="legal-content">
          Prior to opening an account, [Name of person or category of associated
          person] will collect the following information for all accounts, if
          applicable, for any person, entity or organization that is opening a
          new account and whose name is on the account:
          <br />
          (1) the name;
          <br />
          (2) date of birth (for an individual);
          <br />
          (3) an address, which will be a residential or business street address
          (for an individual), an Army Post Office (APO) or Fleet Post Office
          (FPO) box number, or residential or business street address of next of
          kin or another contact individual (for an individual who does not have
          a residential or business street address), or a principal place of
          business, local office, or other physical location (for a person other
          than an individual); and
          <br />
          (4) an identification number, which will be a taxpayer identification
          number (for U.S. persons), or one or more of the following: a taxpayer
          identification number, passport number and country of issuance, alien
          identification card number, or number and country of issuance of any
          other government-issued document evidencing nationality or residence
          and bearing a photograph or other similar safeguard (for non-U.S.
          persons).
          <br />
          <br />
          In the event that a customer has applied for, but has not received, a
          taxpayer identification number, we will confirm that the application
          was filed before the customer opens the account and to obtain the
          taxpayer identification number within a reasonable period of time
          after the account is opened.
          <br />
          <br />
          When opening an account for a foreign business or enterprise that does
          not have an identification number, we will request alternative
          government-issued documentation certifying the existence of the
          business or enterprise.
        </p>
        <h5 className="bleeding">
          b. Customers Who Refuse to Provide Information
        </h5>
        <p className="legal-content">
          If a potential or existing customer either refuses to provide the
          information described above when requested, or appears to have
          intentionally provided misleading information, our firm will not open
          a new account and, after considering the risks involved, consider
          closing any existing account. In either case, our AML Compliance
          Person will be notified so that we can determine whether we should
          report the situation to FinCEN on a SAR.
        </p>
        <h5 className="bleeding">c. Verifying Information</h5>
        <p className="legal-content">
          Based on the risk, and to the extent reasonable and practicable, we
          will ensure that we have a reasonable belief that we know the true
          identity of our customers by using risk- based procedures to verify
          and document the accuracy of the information we get about our
          customers. Torres will analyze the information we obtain to determine
          whether the information is sufficient to form a reasonable belief that
          we know the true identity of the customer (e.g., whether the
          information is logical or contains inconsistencies).
          <br />
          <br />
          We will verify customer identity through documentary means,
          non-documentary means or both. We will use documents to verify
          customer identity when appropriate documents are available. In light
          of the increased instances of identity fraud, we will supplement the
          use of documentary evidence by using the non-documentary means
          described below whenever necessary. We may also use non-documentary
          means, if we are still uncertain about whether we know the true
          identity of the customer. In verifying the information, we will
          consider whether the identifying information that we receive, such as
          the customer’s name, street address, zip code, telephone number (if
          provided), date of birth and Social Security number, allow us to
          determine that we have a reasonable belief that we know the true
          identity of the customer (e.g., whether the information is logical or
          contains inconsistencies).
          <br />
          <br />
          Appropriate documents for verifying the identity of customers include
          the following:
          <br />
          <br />
          • For an individual, an unexpired government-issued identification
          evidencing nationality or residence and bearing a photograph or
          similar safeguard, such as a driver’s license or passport; and
          <br />
          <br />
          • For a person other than an individual, documents showing the
          existence of the entity, such as certified articles of incorporation,
          a government-issued business license, a partnership agreement or a
          trust instrument.
          <br />
          <br />
          We understand that we are not required to take steps to determine
          whether the document that the customer has provided to us for identity
          verification has been validly issued and that we may rely on a
          government-issued identification as verification of a customer’s
          identity. If, however, we note that the document shows some obvious
          form of fraud, we must consider that factor in determining whether we
          can form a reasonable belief that we know the customer’s true
          identity.
          <br />
          <br />
          We will use the following non-documentary methods of verifying
          identity:
          <br />
          <br />
          • Independently verifying the customer’s identity through the
          comparison of information provided by the customer with information
          obtained from a consumer reporting agency, public database or other
          source [identify reporting agency, database, etc.];
          <br />
          <br />
          • Checking references with other financial institutions; or
          <br />
          <br />
          • Obtaining a financial statement.
          <br />
          <br />
          • [add other non-documentary methods, if applicable]
          <br />
          <br />
          We will use non-documentary methods of verification when:
          <br />
          (1) the customer is unable to present an unexpired government-issued
          identification document with a photograph or other similar safeguard;
          <br />
          (2) the firm is unfamiliar with the documents the customer presents
          for identification verification;
          <br />
          (3) the customer and firm do not have face-to-face contact; and
          <br />
          (4) there are other circumstances that increase the risk that the firm
          will be unable to verify the true identity of the customer through
          documentary means.
          <br />
          <br />
          We will verify the information within a reasonable time before or
          after the account is opened. Depending on the nature of the account
          and requested transactions, we may refuse to complete a transaction
          before we have verified the information, or in some instances when we
          need more time, we may, pending verification, restrict the types of
          transactions or dollar amount of transactions. If we find suspicious
          information that indicates possible money laundering, terrorist
          financing activity, or other suspicious activity, we will, after
          internal consultation with the firm's AML Compliance Person, file a
          SAR in accordance with applicable laws and regulations.
          <br />
          <br />
          We recognize that the risk that we may not know the customer’s true
          identity may be heightened for certain types of accounts, such as an
          account opened in the name of a corporation, partnership or trust that
          is created or conducts substantial business in a jurisdiction that has
          been designated by the U.S. as a primary money laundering
          jurisdiction, a terrorist concern, or has been designated as a
          non-cooperative country or territory. We will identify customers that
          pose a heightened risk of not being properly identified. We will also
          take the following additional measures that may be used to obtain
          information about the identity of the individuals associated with the
          customer when standard documentary methods prove to be insufficient:
          [Add additional procedures for verifying identity of certain
          customers, such as obtaining information about beneficial ownership,
          individuals with authority or control over such account. Remember to
          describe who will take the action, when and how they will obtain the
          information and what courses of action may be required.]
        </p>
        <h5 className="bleeding">d. Lack of Verification</h5>
        <p className="legal-content">
          When we cannot form a reasonable belief that we know the true identity
          of a customer, we will do the following: (1) not open an account; (2)
          impose terms under which a customer may conduct transactions while we
          attempt to verify the customer’s identity; (3) close an account after
          attempts to verify a customer’s identity fail; and (4) determine
          whether it is necessary to file a SAR in accordance with applicable
          laws and regulations.
        </p>
        <h5 className="bleeding">e. Recordkeeping</h5>
        <p className="legal-content">
          We will document our verification, including all identifying
          information provided by a customer, the methods used and results of
          verification, and the resolution of any discrepancies identified in
          the verification process. We will keep records containing a
          description of any document that we relied on to verify a customer’s
          identity, noting the type of document, any identification number
          contained in the document, the place of issuance, and if any, the date
          of issuance and expiration date. With respect to non- documentary
          verification, we will retain documents that describe the methods and
          the results of any measures we took to verify the identity of a
          customer. We will also keep records containing a description of the
          resolution of each substantive discrepancy discovered when verifying
          the identifying information obtained. We will retain records of all
          identification information for five years after the account has been
          closed; we will retain records made about verification of the
          customer's identity for five years after the record is made.
        </p>
        <h5 className="bleeding">
          f. Comparison with Government-Provided Lists of Terrorists
        </h5>
        <p className="legal-content">
          At such time as we receive notice that a federal government agency has
          issued a list of known or suspected terrorists and identified the list
          as a list for CIP purposes, we will, within a reasonable period of
          time after an account is opened (or earlier, if required by another
          federal law or regulation or federal directive issued in connection
          with an applicable list), determine whether a customer appears on any
          such list of known or suspected terrorists or terrorist organizations
          issued by any federal government agency and designated as such by
          Treasury in consultation with the federal functional regulators. We
          will follow all federal directives issued in connection with such
          lists.
          <br />
          <br />
          We will continue to comply separately with OFAC rules prohibiting
          transactions with certain foreign countries or their nationals.
        </p>
        <h5 className="bleeding">g. Notice to Customers</h5>
        <p className="legal-content">
          The CIP Rule requires you to provide adequate notice to customers that
          you are requesting information from them to verify their identities.
          You may provide such notice by a sign in your lobby, through other
          oral or written notice, or, for accounts opened online, notice posted
          on your website. No matter which methods of giving notice you choose,
          you must give it before an account is opened.
          <br />
          <br />
          FINRA has produced a Customer Identification Program Notice to assist
          firms in fulfilling this notification requirement. Please refer to the
          FINRA AML web page for further details.
          <br />
          We will provide notice to customers that the firm is requesting
          information from them to verify their identities, as required by
          federal law. We will use the following method to provide notice to
          customers: [describe notice you will provide for each method of
          account-opening your firm uses (i.e., telephone, online, walk-in,
          etc.); the final rule provides the following sample language for
          notice to be provided to a firm’s customers, if appropriate:]
          <br />
          <br />
          Important Information About Procedures for Opening a New Account
          <br />
          To help the government fight the funding of terrorism and money
          laundering activities, federal law requires all financial institutions
          to obtain, verify, and record information that identifies each person
          who opens an account.
          <br />
          <br />
          What this means for you: When you open an account, we will ask for
          your name, address, date of birth and other information that will
          allow us to identify you. We may also ask to see your driver’s license
          or other identifying documents.
        </p>
        <h5 className="bleeding">
          h. Reliance on Another Financial Institution for Identity Verification
        </h5>
        <p className="legal-content">
          We may, under the following circumstances, rely on the performance by
          another financial institution (including an affiliate) of some or all
          of the elements of our CIP with respect to any customer that is
          opening an account or has established an account or similar business
          relationship with the other financial institution to provide or engage
          in services, dealings or other financial transactions:
          <br />
          <br />
          • when such reliance is reasonable under the circumstances;
          <br />
          •when the other financial institution is subject to a rule
          implementing the anti-money laundering compliance program requirements
          of 31 U.S.C. § 5318(h), and is regulated by a federal functional
          regulator; and
          <br />
          •when the other financial institution has entered into a contract with
          our firm requiring it to certify annually to us that it has
          implemented its anti- money laundering program and that it will
          perform (or its agent will perform) specified requirements of the
          customer identification program.
          <br />
          <br />
          [You will not be held responsible for the failure of the other
          financial institution to fulfill adequately your CIP responsibilities,
          provided that you can establish that your reliance was reasonable and
          you have obtained the requisite contracts and certifications.]
        </p>
        <h5 className="legal-content">6.
Customer Due Diligence Rule</h5>
        <p className="legal-content">
        On May 11, 2016, FinCEN adopted a final rule on Customer Due Diligence
Requirements for Financial Institutions (CDD Rule) to clarify and strengthen customer
due diligence for covered financial institutions, including broker-dealers. The Rule
becomes effective on May 11, 2018.
<br />
          <br />
In its CDD Rule, FinCEN identifies four components of customer due diligence: (1)
customer identification and verification; (2) beneficial ownership identification and
verification; (3) understanding the nature and purpose of customer relationships for the
purpose of developing a customer risk profile; and (4) conducting ongoing monitoring to
identify and report suspicious transactions and, on a risk basis, to maintain and update
customer information. As the first component is already an AML program requirement
(under the CIP Rule), the CDD Rule focuses on the other three components.
<br />
          <br />
Specifically, the CDD Rule focuses particularly on the second component by adding a
new requirement that covered financial institutions establish and maintain written
procedures as part of their AML programs that are reasonably designed to identify and
verify the identities of beneficial owners of legal entity customers, subject to certain
exclusions and exemptions.
<br />
          <br />
Under the CDD Rule, member firms must obtain from the natural person opening the
account on behalf of the legal entity customer, the identity of the beneficial owners of the
entity. In addition, that individual must certify, to the best of his or her knowledge, as to
the accuracy of the information. FinCEN intends that the legal entity customer identify its
ultimate beneficial owner(s) and not “nominees” or “straw men.”
<br />
          <br />
The CDD Rule does not prescribe the form in which member firms must collect the
required information, which includes the name, date of birth, address and Social Security
number or other government identification number of beneficial owners. Rather, member
firms may choose to obtain the information by using FinCEN’s standard certification
form in Appendix A of the CDD Rule (at https://www.fincen.gov/resources/filing-
information) or by another means, provided that the chosen method satisfies the
identification requirements in the CDD Rule. In any case, the CDD Rule requires that
member firms maintain records of the beneficial ownership information they obtain.
Once member firms obtain the required beneficial ownership information, the CDD Rule
requires that firms verify the identity of the beneficial owner(s) – in other words, that they
are who they say they are – and not their status as beneficial owners through risk-based
procedures that include, at a minimum, the elements required for CIP procedures for
verifying the identity of individual customers. Such verification must be completed within
a reasonable time after account opening. Member firms may rely on the beneficial
ownership information supplied by the individual opening the account, provided that they
have no knowledge of facts that would reasonably call into question the reliability of that
information.
<br />
          <br />
The CDD Rule’s requirements with respect to beneficial owners of legal entity customers
applies on a prospective basis, that is, only with respect to legal entity customers that
open new accounts from the date of the CDD Rule’s implementation. However, member
firms should obtain beneficial ownership information for an existing legal entity
customer if, during the course of normal monitoring, it receives information that is
needed to assess or reevaluate the risk of the customer.
<br />
          <br />
The required records to be created and maintained must include: (i) for identification,
any identifying information obtained by the member firm pursuant to the beneficial
ownership identification requirements of the CDD Rule, including without limitation the
certification (if obtained); and (ii) for verification, a description of any document relied
on (noting the type, any identification number, place of issuance and, if any, date of
issuance and expiration), of any non-documentary methods and the results of any
measures undertaken, and the resolution of each substantive discrepancy. In addition to
complying with existing SEC and FINRA record retention requirements, member firms
must maintain the records collected for identification purposes for a minimum of five
years after the account is closed, and for verification purposes, for five years after the
record is made.
<br />
          <br />
Member firms may rely on the performance by another financial institution (including an
affiliate) of the requirements of the CDD Rule with respect to any legal entity customer of
the member firm that is opening, or has opened, an account or has established a similar
business relationship with the other financial institution to provide or engage in services,
dealings, or other financial transactions, provided that: (1) such reliance is reasonable
under the circumstances; (2) the other financial institution is subject to a rule
implementing 31 U.S.C. 5318(h) and is regulated by a Federal functional regulator; and
(3) the other financial institution enters into a contract requiring it to certify annually to
the member firm that it has implemented its AML program, and that it will perform (or its
agent will perform) the specified requirements of the member firm’s procedures to
comply with the CDD Rule.
<br />
          <br />
The CDD Rule also addresses the third and fourth components, which FinCEN states
“are already implicitly required for covered financial institutions to comply with their
suspicious activity reporting requirements,” by amending the existing AML program
rules for covered financial institutions to explicitly require these components to be
included in AML programs as a new “fifth pillar.” These requirements are discussed
further below.
          <br />
 <br />          
We do not open or maintain accounts for legal entity customers within the meaning of 31
CFR 1010.230. If in the future the firm elects to open accounts for legal entity customers,
we will first establish, document and ensure the implementation of appropriate CDD
procedures. (Note that a change in the firm’s business to accept accounts for legal entity
customers may be a material change in business requiring an application, review and
approval by FINRA. See NASD Rule 1017).
        </p>
        <h5 className="legal-content">7.
Correspondent Accounts for Foreign Shell Banks</h5>
<h5 className="bleeding">
a. Detecting and Closing Correspondent Accounts of Foreign Shell Banks
        </h5>
        <p className="legal-content">
        Broker-dealers are prohibited from establishing, maintaining, administering or
managing correspondent accounts in the United States for foreign shell banks. Broker-
dealers also must take reasonable steps to ensure that any correspondent account
established, maintained, administered or managed by the broker-dealer in the United
States for a foreign bank is not being used by that foreign bank to indirectly provide
banking services to a foreign shell bank. The BSA regulations allow covered financial
institutions to receive a safe harbor for compliance with these requirements if they use
the certification process described in the regulations. A covered financial institution must
obtain a certification from each foreign bank for which it maintains a correspondent
account “at least once every three years” to maintain the safe harbor.
<br />
          <br />
In the context above, “correspondent account” is an account established for a foreign
bank to receive deposits from, or to make payments or other disbursements on behalf of,
the foreign bank, or to handle other financial transactions related to such foreign bank.
Foreign shell banks are foreign banks without a physical presence in any country. A
"foreign bank" is any bank organized under foreign law or an agency, branch or office of
a bank located outside the U.S. The term does not include an agent, agency, branch or
office within the U.S. of a bank organized under foreign law.
<br />
          <br />
The prohibition does not include foreign shell banks that are regulated affiliates. Foreign
shell banks that are regulated affiliates are affiliates of a depository institution, credit
union or foreign bank that maintains a physical presence in the U.S., or a foreign
country, and are subject to supervision by a banking authority in the country regulating
that affiliated depository institution, credit union or foreign bank. Foreign branches of a
U.S. broker-dealer are not subject to this requirement, and “correspondent accounts” of
foreign banks that are clearly established, maintained, administered or managed only at
foreign branches are not subject to this regulation.
<br />
          <br />
Describe how your firm will identify foreign banks with which the firm has accounts, and
then detect and close correspondent accounts for foreign shell banks.
          <br />
          <br />
          <strong>NOTE: If your firm does not establish, maintain, administer or manage correspondent
accounts for foreign banks, state that this is your firm’s policy and describe the
internal controls that your firm will implement to detect any attempt to open a
correspondent account.</strong>
<br />
          <br />
          We will identify foreign bank accounts and any such account that is a correspondent
account (any account that is established for a foreign bank to receive deposits from, or to
make payments or other disbursements on behalf of, the foreign bank, or to handle other
financial transactions related to such foreign bank) for foreign shell banks by [describe
procedure to detect such accounts]. Upon finding or suspecting such accounts, firm
employees will notify the AML Compliance Person, who will terminate any verified
correspondent account in the United States for a foreign shell bank. We will also
terminate any correspondent account that we have determined is not maintained by a
foreign shell bank but is being used to provide services to such a shell bank. We will
exercise caution regarding liquidating positions in such accounts and take reasonable
steps to ensure that no new positions are established in these accounts during the
termination period. We will terminate any correspondent account for which we have not
obtained the information described in Appendix A of the regulations regarding shell
banks within the time periods specified in those regulations.
        </p>
        <h5 className="bleeding">
        b.
  Certifications
        </h5>
        <p className="legal-content">
        Describe your process for obtaining certain required information from any foreign bank
account holders and for obtaining the necessary certifications at least once every three
years to rely on the safe harbor provided by the BSA regulations.
<br />
          <br />
TEXT EXAMPLE: We will require our foreign bank account holders to identify the
          owners of the foreign bank if it is not publicly traded, the name and street address of a
          person who resides in the United States and is authorized and has agreed to act as agent
          for acceptance of legal process, and an assurance that the foreign bank is not a shell bank
          nor is it facilitating activity of a shell bank. In lieu of this information the foreign bank
          may submit the Certification Regarding Correspondent Accounts For Foreign Banks
          provided in the BSA regulations. We will re-certify when we believe that the information
          is no longer accurate or at least once every three years.
        </p>
        <h5 className="bleeding">
        c. Record keeping for Correspondent Accounts for Foreign Banks
        </h5>
        <p className="legal-content">
        We will keep records identifying the owners of foreign banks with U.S. correspondent
accounts and the name and address of the U.S. agent for service of legal process for those
banks.
        </p>
        <h5 className="bleeding">d. Summons or Subpoena of Foreign Bank Records; Termination of
Correspondent Relationships with Foreign Bank</h5>
        <p className="legal-content">
        The Secretary of the Treasury or the Attorney General of the United States may issue a
summons or subpoena to any foreign bank that maintains a correspondent account in the
United States and may request records related to such correspondent account, including
records maintained outside of the United States relating to the deposit of funds into the
foreign bank. The summons or subpoena may be served on the foreign bank in the United
States if the foreign bank has a representative in the United States, or in a foreign
country pursuant to any mutual legal assistance treaty, multilateral agreement or other
request for international law enforcement assistance.
<br />
          <br />
A broker-dealer that maintains a correspondent account for a foreign bank in the United
States must maintain records in the United States identifying the owners of such foreign
bank whose shares are not publicly traded and the name and street address of a person
who resides in the United States and is authorized, and has agreed to be an agent to
accept service of legal process for the foreign bank’s correspondent account. Upon
receipt of a written request from a federal law enforcement officer for this information,
the broker-dealer must provide such information to the requesting officer no later than
seven days after receipt of the request.
<br />
          <br />
Additionally, such broker-dealer must terminate any correspondent relationship with a
foreign bank not later than 10 business days after receipt of written notice from the
Secretary of the Treasury or the Attorney General of the United States that the foreign
bank has failed to: (1) comply with a summons or subpoena issued by these two entities;
or (2) initiate proceedings in a United States court contesting such summons or
subpoena.
<br />
          <br />
Describe your firm’s procedures for handling requests from federal law enforcement
officers for the information described above, and if necessary, terminating a
correspondent relationship with a foreign bank that has failed to comply or contest a
summons or subpoena issued by the Secretary of the Treasury or the Attorney General of
the United States.
<br />
          <br />
When we receive a written request from a federal law enforcement officer for
information identifying the non-publicly traded owners of any foreign bank for which we
maintain a correspondent account in the United States and/or the name and address of a
person residing in the United States who is an agent to accept service of legal process for
a foreign bank’s correspondent account, we will provide that information to the
requesting officer not later than seven days after receipt of the request. We will close,
within 10 days, any correspondent account for a foreign bank that we learn from FinCEN or the Department of Justice has failed to comply with a summons or subpoena issued by
the Secretary of the Treasury or the Attorney General of the United States or has failed to
contest such a summons or subpoena. We will scrutinize any correspondent account
activity during that 10-day period to ensure that any suspicious activity is appropriately
reported and to ensure that no new positions are established in these correspondent
accounts.
</p>
<h5 className="legal-content">8.
        Due Diligence and Enhanced Due Diligence Requirements for
Correspondent Accounts of Foreign Financial Institutions</h5>
<h5 className="bleeding">a.
        Due Diligence for Correspondent Accounts of Foreign Financial
Institutions</h5>
<p className="legal-content">The BSA, as amended by Section 312 of the USA PATRIOT Act, and the rules
promulgated thereunder require, in part, that a firm, as part of its anti-money laundering
program, establish a due diligence program that includes appropriate, specific, risk-
based and, where necessary, enhanced policies, procedures and controls that are
reasonably designed to enable the firm to detect and report, on an ongoing basis, any
known or suspected money laundering activity conducted through or involving any
correspondent account established, maintained, administered or managed by the firm for
a foreign financial institution.
<br />
<br />
We have reviewed our accounts and we do not have, nor do we intend to open or
maintain, correspondent accounts for foreign financial institutions.</p>
<h5 className="bleeding">b.
Enhanced Due Diligence</h5>
<p className="legal-content">The BSA, as amended by Section 312 of the USA PATRIOT Act, and the rules
        promulgated thereunder require, in part, that a firm’s due diligence program for
        correspondent accounts of foreign financial institutions include the performance of
        enhanced due diligence on correspondent accounts for any foreign bank that operates
under:</p>
        <p className="bleeding">
        (1) an offshore banking license;
        <br />
  (2) a banking license issued by a foreign country that has been designated as non-
  cooperative with international anti-money laundering principles or procedures by
  an intergovernmental group or organization of which the United States is a
  member and with which designation the U.S. representative to the group or
  organization concurs; or
  <br />
  (3) a banking license issued by a foreign country that has been designated by the
  Secretary of the Treasury as warranting special measures due to money
  laundering concerns.
</p>
<p className="legal-content">We will assess any correspondent accounts for foreign financial institutions to determine
        whether they are correspondent accounts that have been established, maintained,
administered or managed for any foreign bank that operates under:</p>
        <p className="bleeding">
        (1) an offshore banking license;
        <br />
  (2) a banking license issued by a foreign country that has been designated as non-
  cooperative with international anti-money laundering principles or procedures by
  an intergovernmental group or organization of which the United States is a
  member and with which designation the U.S. representative to the group or
  organization concurs; or
  <br />
  (3) a banking license issued by a foreign country that has been designated by the
  Secretary of the Treasury as warranting special measures due to money
  laundering concerns.
        </p>
        <p className="legal-content">
        If we determine that we have any correspondent accounts for these specified foreign
  banks, we will perform enhanced due diligence on these correspondent accounts. The
  enhanced due diligence that we will perform for each correspondent account will include,
  at a minimum, procedures to take reasonable steps to:
        </p>
        <p className="bleeding">(1)
conduct enhanced scrutiny of the correspondent account to guard against
money laundering and to identify and report any suspicious transactions.
Such scrutiny will not only reflect the risk assessment that is described in
Section 8.a. above, but will also include procedures to, as appropriate:</p>
        <p className="bleeding2">
        (i) obtain (e.g., using a questionnaire) and consider information
related to the foreign bank’s AML program to assess the extent to
which the foreign bank’s correspondent account may expose us to
any risk of money laundering;
</p>
          <p className="bleeding">
(ii) monitor transactions to, from or through the correspondent account
in a manner reasonably designed to detect money laundering and
suspicious activity (this monitoring may be conducted manually or
electronically and may be done on an individual account basis or
by product activity); and
</p>
          <p className="bleeding">
(iii) obtain information from the foreign bank about the identity of any
person with authority to direct transactions through any
correspondent account that is a payable-through account (a
correspondent account maintained for a foreign bank through
which the foreign bank permits its customer to engage, either
directly or through a subaccount, in banking activities) and the
sources and beneficial owners of funds or other assets in the
payable-through account.
        </p>
        <p className="bleeding">
        (2) determine whether the foreign bank maintains correspondent accounts for
other foreign banks that enable those other foreign banks to gain access to
the correspondent account under review and, if so, to take reasonable steps
to obtain information to assess and mitigate the money laundering risks
associated with such accounts, including, as appropriate, the identity of
those other foreign banks; and
</p>
          <p className="bleeding">
(3) if the foreign bank’s shares are not publicly traded, determine the identity
          of each owner and the nature and extent of each owner’s ownership
          interest. We understand that for purposes of determining a private foreign
          bank’s ownership, an “owner” is any person who directly or indirectly
          owns, controls or has the power to vote 10 percent or more of any class of
          securities of a foreign bank. We also understand that members of the same
          family shall be considered to be one person.
        </p>
        <h5 className="bleeding">c.
Special Procedures When Due Diligence or Enhanced Due Diligence
Cannot Be Performed</h5>
        <p className="legal-content">
        A firm must include procedures to follow in circumstances where the firm cannot perform
appropriate due diligence for a correspondent account of a foreign financial institution
or the enhanced due diligence that is required for correspondent accounts for certain
foreign banks.
<br />
<br />
TEXT EXAMPLE: In the event there are circumstances in which we cannot perform
appropriate due diligence with respect to a correspondent account, we will determine, at a
minimum, whether to refuse to open the account, suspend transaction activity, file a SAR,
close the correspondent account and/or take other appropriate action.
        </p>
        <h5 className="legal-content">9.
Due Diligence and Enhanced Due Diligence Requirements for
Private Banking Accounts/Senior Foreign Political Figures</h5>
        <p className="legal-content">We do not open or maintain private banking accounts.</p>
        <h5 className="legal-content">10.
Compliance with FinCEN’s Issuance of Special Measures Against
Foreign Jurisdictions, Financial Institutions or International
Transactions of Primary Money Laundering Concern</h5>
        <p className="legal-content">
  If FinCEN issues a final rule imposing a special measure against one or more foreign
                jurisdictions or financial institutions, classes of international transactions or types of
                accounts deeming them to be of primary money laundering concern, we understand that
                we must read FinCEN’s final rule and follow any prescriptions or prohibitions contained
                in that rule. For example, if the final rule deems a certain bank and its subsidiaries
                (Specified Banks) to be of primary money laundering concern, a special measure may be
                a prohibition from opening or maintaining a correspondent account in the United States
        for, or on behalf of, the Specified Banks. In that case, we will take the following steps:
</p>
        <p className="bleeding">
        (1) We will review our account records, including correspondent account
records, to ensure that our accountholders and correspondent
accountholders maintain no accounts directly for, or on behalf of, the
Specified Banks; and
</p>
          <p className="bleeding">
(2) We will apply due diligence procedures to our correspondent accounts that
are reasonably designed to guard against indirect use of those accounts by
the Specified Banks. Such due diligence may include:
</p>
        <p className="bleeding2">
        • Notification to Correspondent Accountholders
        <br />
<br />
  We will notify our correspondent accountholders that the account
  may not be used to provide the Specified Banks with access to us
  [provide details of what the language of the notice will state].
  <br />
<br />
  We will transmit the notice to our correspondent accounts using
  the following method [specify], and we shall retain documentation
  of such notice.
<br />
<br />
•
Identification of Indirect Use
<br />
<br />
We will take reasonable steps in order to identify any indirect use
of our correspondent accounts by the Specified Banks. We will
determine if such indirect use is occurring from transactional
records that we maintain in the normal course of business. We will
take a risk-based approach when deciding what, if any, additional
due diligence measures we should adopt to guard against the
indirect use of correspondent accounts by the Specified Banks,
based on risk factors such as the type of services offered by, and
geographic locations of, their correspondents.
<br />
<br />
We understand that we have an ongoing obligation to take
reasonable steps to identify all correspondent account services our
correspondent accountholders may directly or indirectly provide to
the Specified Banks.
</p>
<h5 className="legal-content">11.
Monitoring Accounts for Suspicious Activity</h5>
<p className="legal-content">We will monitor account activity for unusual size, volume, pattern or type of transactions,
        taking into account risk factors and red flags that are appropriate to our business. (Red
flags are identified in Section 11.b. below.)</p>
        <h5 className="bleeding">a. Emergency Notification to Law Enforcement by Telephone</h5>
        <p className="legal-content">
        In situations involving violations that require immediate attention, such as terrorist
financing or ongoing money laundering schemes, we will immediately call an appropriate
law enforcement authority. If a customer or company appears on OFAC’s SDN list, we
will call the OFAC Hotline at (800) 540-6322. Other contact numbers we will use are:
FinCEN’s Financial Institutions Hotline ((866) 556-3974) (especially to report
transactions relating to terrorist activity), local U.S. Attorney’s office (insert contact
number), local FBI office (insert contact number) and local SEC office (insert contact
number) (to voluntarily report such violations to the SEC in addition to contacting the
appropriate law enforcement authority). If we notify the appropriate law enforcement
authority of any such activity, we must still file a timely a SAR.
        </p>
        <h5 className="bleeding">
        b. Red Flags
        </h5>
        <p className="legal-content">
        Red flags that signal possible money laundering or terrorist financing include, but are not
  limited to:
        </p>
        <p className="bleeding">
       <strong>Customers – Insufficient or Suspicious Information</strong> 
        <br />
<br />
  • Provides unusual or suspicious identification documents that cannot be readily
  verified.
  <br />
          <br />
  • Reluctant to provide complete information about nature and purpose of business,
  prior banking relationships, anticipated account activity, officers and directors or
  business location.
  <br />
<br />
  • Refuses to identify a legitimate source for funds or information is false,
  misleading or substantially incorrect.
  <br />
<br />
  • Background is questionable or differs from expectations based on business
  activities.
  <br />
<br />
  • Customer with no discernable reason for using the firm’s service.
  <br />
<br />
<strong> Efforts to Avoid Reporting and Recordkeeping</strong>
  <br />
<br />
  • Reluctant to provide information needed to file reports or fails to proceed with
  transaction.
  <br />
<br />
  • Tries to persuade an employee not to file required reports or not to maintain
  required records.
  <br />
          <br />
  • “Structures” deposits, withdrawals or purchase of monetary instruments below a
  certain amount to avoid reporting or recordkeeping requirements.
  <br />
<br />
  • Unusual concern with the firm’s compliance with government reporting
  requirements and firm’s AML policies.
  <br />
<br />
<strong>Certain Funds Transfer Activities</strong>
  <br />
<br />
          • Wire transfers to/from financial secrecy havens or high-risk geographic location
          without an apparent business reason.
          <br />
<br />
          • Many small, incoming wire transfers or deposits made using checks and money
          orders. Almost immediately withdrawn or wired out in manner inconsistent with
          customer’s business or history. May indicate a Ponzi scheme.
          <br />
<br />
          • Wire activity that is unexplained, repetitive, unusually large or shows unusual
          patterns or with no apparent business purpose.
        </p>
        <p className="bleeding">
          <strong>Certain Deposits or Dispositions of Physical Certificates</strong>
          <br />
<br />
• Physical certificate is titled differently than the account.
<br />
<br />
• Physical certificate does not bear a restrictive legend, but based on history of the
stock and/or volume of shares trading, it should have such a legend.
<br />
<br />
• Customer’s explanation of how he or she acquired the certificate does not make
sense or changes.
<br />
<br />
• Customer deposits the certificate with a request to journal the shares to multiple
accounts, or to sell or otherwise transfer ownership of the shares.
<br />
<br />
<strong>Certain Securities Transactions</strong>
<br />
<br />
• Customer engages in prearranged or other non-competitive trading, including
wash or cross trades of illiquid securities.
<br />
<br />
• Two or more accounts trade an illiquid stock suddenly and simultaneously.
<br />
<br />
• Customer journals securities between unrelated accounts for no apparent
business reason.
<br />
<br />
• Customer has opened multiple accounts with the same beneficial owners or
controlling parties for no apparent business reason.
<br />
<br />
•. Customer transactions include a pattern of receiving stock in physical form or the
incoming transfer of shares, selling the position and wiring out proceeds.
<br />
<br />
• Customer’s trading patterns suggest that he or she may have inside information.
Transactions Involving Penny Stock Companies
<br />
<br />
• Company has no business, no revenues and no product.
<br />
<br />
• Company has experienced frequent or continuous changes in its business
structure.
<br />
<br />
• Officers or insiders of the issuer are associated with multiple penny stock issuers.
<br />
<br />
• Company undergoes frequent material changes in business strategy or its line of
business.
<br />
<br />
• Officers or insiders of the issuer have a history of securities violations.
<br />
<br />
• Company has not made disclosures in SEC or other regulatory filings.
<br />
<br />
•
Company has been the subject of a prior trading suspension.
<br />
<br />
          <strong>Transactions Involving Insurance Products</strong>
          <br />
<br />
• Cancels an insurance contract and directs funds to a third party.
<br />
<br />
• Structures withdrawals of funds following deposits of insurance annuity checks
signaling an effort to avoid BSA reporting requirements.
<br />
<br />
• Rapidly withdraws funds shortly after a deposit of a large insurance check when
the purpose of the fund withdrawal cannot be determined.
<br />
<br />
• Cancels annuity products within the free look period which, although could be
legitimate, may signal a method of laundering funds if accompanied with other
suspicious indicia.
<br />
<br />
• Opens and closes accounts with one insurance company then reopens a new
account shortly thereafter with the same insurance company, each time with new
ownership information.
<br />
<br />
• Purchases an insurance product with no concern for investment objective or
performance.
<br />
<br />
• Purchases an insurance product with unknown or unverifiable sources of funds,
such as cash, official checks or sequentially numbered money orders.
<br />
<br />
          <strong>Activity Inconsistent With Business</strong>
          <br />
<br />
• Transactions patterns show a sudden change inconsistent with normal activities.
<br />
<br />
• Unusual transfers of funds or journal entries among accounts without any
apparent business purpose.
<br />
<br />
• Maintains multiple accounts, or maintains accounts in the names of family
members or corporate entities with no apparent business or other purpose.
<br />
<br />
• Appears to be acting as an agent for an undisclosed principal, but is reluctant to
provide information.
<br />
<br />
<strong>Other Suspicious Customer Activity</strong>
<br />
<br />
•
Unexplained high level of account activity with very low levels of securities
transactions.
<br />
<br />
• Funds deposits for purchase of a long-term investment followed shortly by a
request to liquidate the position and transfer the proceeds out of the account.
<br />
<br />
• Law enforcement subpoenas.
<br />
<br />
• Large numbers of securities transactions across a number of jurisdictions.
<br />
<br />
• Buying and selling securities with no purpose or in unusual circumstances (e.g.,
churning at customer’s request).
<br />
<br />
• Payment by third-party check or money transfer without an apparent connection
to the customer.
<br />
<br />
• Payments to third-party without apparent connection to customer.
<br />
<br />
• No concern regarding the cost of transactions or fees (i.e., surrender fees, higher
than necessary commissions, etc.).
        </p>
        
        <h5 className="legal-content">12.
Suspicious Transactions and BSA Reporting</h5>
<p className="legal-content">Firms are exempt from reporting on a SAR the following violations: (1) a robbery or
        burglary that is committed or attempted and already reported to appropriate law
        enforcement authorities; (2) lost, missing, counterfeit or stolen securities that the firm
        has reported pursuant to Exchange Act Rule 17f-1; and (3) violations of the Federal
        securities laws or self-regulatory organization (SRO) rules by the firm, its officers,
        directors, employees or registered representatives, that are reported appropriately to the
        SEC or SRO, except for a violation of Exchange Act Rule 17a-8, which must be reported
        on a SAR. However, if a firm relies on one of these exemptions, it may be required to
        demonstrate that it relied on one of these exemptions and must maintain records, for at
least five years, of its determination not to file a SAR based on the exemption.</p>
<h5 className="bleeding">a. Filing a SAR</h5>
<p className="legal-content">We will file SARs with FinCEN for any transactions (including deposits and transfers)
                conducted or attempted by, at or through our firm involving $5,000 or more of funds or
                assets (either individually or in the aggregate) where we know, suspect or have reason to
suspect:</p>
        <p className="bleeding">
        (1) the transaction involves funds derived from illegal activity or is intended or
conducted in order to hide or disguise funds or assets derived from illegal activity
as part of a plan to violate or evade federal law or regulation or to avoid any
transaction reporting requirement under federal law or regulation;
        </p>
        <p className="bleeding">
(2) the transaction is designed, whether through structuring or otherwise, to evade any
requirements of the BSA regulations;
</p>
        <p className="bleeding">
(3) the transaction has no business or apparent lawful purpose or is not the sort in
which the customer would normally be expected to engage, and after examining
the background, possible purpose of the transaction and other facts, we know of
no reasonable explanation for the transaction; or
</p>
        <p className="bleeding">
(4) the transaction involves the use of the firm to facilitate criminal activity.
</p>
        <p className="legal-content">
        We will also file a SAR and notify the appropriate law enforcement authority in
situations involving violations that require immediate attention, such as terrorist
financing or ongoing money laundering schemes. In addition, although we are not
required to, we may contact that SEC in cases where a SAR we have filed may require
immediate attention by the SEC. See Section 11 for contact numbers. We also understand
that, even if we notify a regulator of a violation, unless it is specifically covered by one of
the exceptions in the SAR rule, we must file a SAR reporting the violation.
<br />
<br />
We may file a voluntary SAR for any suspicious transaction that we believe is relevant to
the possible violation of any law or regulation but that is not required to be reported by us
under the SAR rule. It is our policy that all SARs will be reported regularly to the Board
of Directors and appropriate senior management, with a clear reminder of the need to
maintain the confidentiality of the SAR.
<br />
<br />
We will report suspicious transactions by completing a SAR, and we will collect and
maintain supporting documentation as required by the BSA regulations. We will file a
SAR-SF no later than 30 calendar days after the date of the initial detection of the facts
that constitute a basis for filing a SAR. If no suspect is identified on the date of initial
detection, we may delay filing the SAR for an additional 30 calendar days pending
identification of a suspect, but in no case will the reporting be delayed more than 60
calendar days after the date of initial detection. The phrase “initial detection” does not
mean the moment a transaction is highlighted for review. The 30-day (or 60-day) period
begins when an appropriate review is conducted and a determination is made that the
transaction under review is “suspicious” within the meaning of the SAR requirements. A
review must be initiated promptly upon identification of unusual activity that warrants
investigation.
<br />
<br />
We will retain copies of any SAR filed and the original or business record equivalent of
any supporting documentation for five years from the date of filing the SAR-SF. We will
identify and maintain supporting documentation and make such information available to
FinCEN, any other appropriate law enforcement agencies, federal or state securities
regulators or SROs upon request.
<br />
<br />
We will not notify any person involved in the transaction that the transaction has been
reported, except as permitted by the BSA regulations. We understand that anyone who is
subpoenaed or required to disclose a SAR or the information contained in the SAR will,
except where disclosure is requested by FinCEN, the SEC, or another appropriate law
enforcement or regulatory agency, or an SRO registered with the SEC, decline to produce
the SAR or to provide any information that would disclose that a SAR was prepared or
filed. We will notify FinCEN of any such request and our response.
        </p>  
        <h5 className="bleeding">b. Currency Transaction Reports</h5>
        <p className="legal-content">A firm must file a currency transaction report (CTR) for each deposit, withdrawal,
exchange of currency, or other payment or transfer by, through or to the firm that
involves a transaction in currency of more than $10,000 or for multiple transactions in
currency of more than $10,000 when a financial institution knows that the transactions
are by or on behalf of the same person during any one business day, unless the
transaction is subject to certain exemptions. “Currency” is defined as “coin and
currency of the United States or of any other country” that is “customarily used and
accepted as money in the country in which issued; and a cashier’s check (by whatever
name called, including ‘treasurer’s check’ and ‘bank check’), bank draft, traveler’s
check, or money order having a face amount of not more than $10,000 received in a
designated reporting transaction . . . or received in any transaction in which the recipient
knows that such instrument is being used in an attempt to avoid the reporting of the
transaction.”</p>
<h5 className="bleeding">c. Currency and Monetary Instrument Transportation Reports</h5>
        <p className="legal-content">A currency and monetary instrument transportation report (CMIR) must be filed
whenever more than $10,000 in currency or other monetary instruments is physically
transported, mailed or shipped into or from the United States. A CMIR also must be filed
whenever a person receives more than $10,000 in currency or other monetary
instruments that has been physically transported, mailed or shipped from outside the
United States and a CMIR has not already been filed with respect to the currency or
other monetary instruments received. A CMIR is not required to be filed by a securities
broker-dealer mailing or shipping currency or other monetary instruments through the
postal service or by common carrier. “Monetary instruments” include the following:
currency (defined above); traveler's checks in any form; all negotiable instruments
(including personal and business checks, official bank checks, cashier's checks, third-
party checks, promissory notes and money orders) that are either in bearer form,
endorsed without restriction, made out to a fictitious payee or otherwise in such form that
title passes upon delivery; incomplete negotiable instruments that are signed but omit the
payee's name; and securities or stock in bearer form or otherwise in such form that title
passes upon delivery.
<br />
<br />
Our firm may prohibit both the receipt of currency or other monetary instruments that
have been transported, mailed or shipped to us from outside of the United States, and the
physical transportation, mailing or shipment of currency or other monetary instruments
by any means other than through the postal service or by common carrier. We will file a
CMIR with the Commissioner of Customs if we discover that we have received or caused
or attempted to receive from outside of the U.S. currency or other monetary instruments
in an aggregate amount exceeding $10,000 at one time (on one calendar day or, if for the
purposes of evading reporting requirements, on one or more days). We will also file a
CMIR if we discover that we have physically transported, mailed or shipped or caused or
attempted to physically transport, mail or ship by any means other than through the postal
service or by common carrier currency or other monetary instruments of more than
$10,000 at one time (on one calendar day or, if for the purpose of evading the reporting
requirements, on one or more days). We will use the CMIR Form provided on FinCEN’s
website.</p>
        
<h5 className="bleeding">d. Foreign Bank and Financial Accounts Reports</h5>
        <p className="legal-content">We will file a Foreign Bank and Financial Accounts Report (FBAR) for any financial
accounts of more than $10,000 that we hold, or for which we have signature or other
authority over, in a foreign country. We will use the BSA E-Filing System provided on
FinCEN’s website.</p>
<h5 className="bleeding">e.
Monetary Instrument Purchases</h5>
<p className="legal-content">We do not issue bank checks or drafts, cashier’s checks, money orders or traveler’s
checks in the amount of $3,000 or more.</p>
<h5 className="bleeding">f. Funds Transmittals of $3,000 or More Under the Travel Rule</h5>
        <p className="legal-content">
        TEXT EXAMPLE: When we are the transmittor’s financial institution in funds of $3,000
or more, we will retain either the original or a copy (e.g., microfilm, electronic record) of
the transmittal order. We will also record on the transmittal order the following
information: (1) the name and address of the transmittor; (2) if the payment is ordered
from an account, the account number; (3) the amount of the transmittal order; (4) the
execution date of the transmittal order; and (5) the identity of the recipient’s financial
institution. In addition, we will include on the transmittal order as many of the following
items of information as are received with the transmittal order: (1) the name and address
of the recipient; (2) the account number of the recipient; (3) any other specific identifier
of the recipient; and (4) any form relating to the transmittal of funds that is completed or
signed by the person placing the transmittal order.
<br />
<br />
We will also verify the identity of the person placing the transmittal order (if we are the
transmitting firm), provided the transmittal order is placed in person and the transmittor is
not an established customer of the firm (i.e., a customer of the firm who has not
previously maintained an account with us or for whom we have not obtained and
maintained a file with the customer's name, address, taxpayer identification number, or, if
none, alien identification number or passport number and country of issuance). If a
transmittor or recipient is conducting business in person, we will obtain: (1) the person’s
name and address; (2) the type of identification reviewed and the number of the
identification document (e.g., driver’s license); and (3) the person’s taxpayer
identification number (e.g., Social Security or employer identification number) or, if
none, alien identification number or passport number and country of issuance, or a
notation in the record the lack thereof. If a transmittor or recipient is not conducting
business in person, we shall obtain the person’s name, address, and a copy or record of
the method of payment (e.g., check or credit card transaction). In the case of transmittors
only, we shall also obtain the transmittor’s taxpayer identification number (e.g., Social
Security or employer identification number) or, if none, alien identification number or
passport number and country of issuance, or a notation in the record of the lack thereof.
In the case of recipients only, we shall obtain the name and address of the person to
which the transmittal was sent.
        </p>
        <h5 className="legal-content">13.
AML Recordkeeping</h5>
        <h5 className="bleeding">a. Responsibility for Required AML Records and SAR Filing</h5>
        <p className="legal-content">Your firm must establish procedures to maintain all applicable AML program records
and reviews.
<br />
<br />
Our AML Compliance Person and his or her designee will be responsible for ensuring
that AML records are maintained properly and that SARs are filed as required.
<br />
<br />
In addition, as part of our AML program, our firm will create and maintain SARs, CTRs,
CMIRs, FBARs, and relevant documentation on customer identity and verification (See
Section 5 above) and funds transmittals. We will maintain SARs and their accompanying
documentation for at least five years. We will keep other documents according to existing
BSA and other recordkeeping requirements, including certain SEC rules that require six-
year retention periods (e.g., Exchange Act Rule 17a-4(a) requiring firms to preserve for a
period of not less than six years, all records required to be retained by Exchange Act Rule
17a-3(a)(1)-(3), (a)(5), and (a)(21)-(22) and Exchange Act Rule 17a-4(e)(5) requiring
firms to retain for six years account record information required pursuant to Exchange
Act Rule 17a-3(a)(17)).</p>
        <h5 className="bleeding">b. SAR Maintenance and Confidentiality</h5>
        <p className="legal-content">
        We will hold SARs and any supporting documentation confidential. We will not inform
  anyone outside of FinCEN, the SEC, an SRO registered with the SEC or other
  appropriate law enforcement or regulatory agency about a SAR. We will refuse any
  subpoena requests for SARs or for information that would disclose that a SAR has been
  prepared or filed and immediately notify FinCEN of any such subpoena requests that we
  receive. See Section 11 for contact numbers. We will segregate SAR filings and copies of
  supporting documentation from other firm books and records to avoid disclosing SAR
  filings. Our AML Compliance Person will handle all subpoenas or other requests for
  SARs. [Describe any other retention or confidentiality procedures of your firm for SARs.]
  We may share information with another financial institution about suspicious transactions
  in order to determine whether we will jointly file a SAR according to the provisions of
  Section 3.d. In cases in which we file a joint SAR for a transaction that has been handled
  both by us and another financial institution, both financial institutions will maintain a
  copy of the filed SAR.
        </p>
        <h5 className="bleeding">c. Additional Records</h5>
        <p className="legal-content">
        We shall retain either the original or a microfilm or other copy or reproduction of each of
the following:
<br />
<br />
• A record of each extension of credit in an amount in excess of $10,000, except an
extension of credit secured by an interest in real property. The record shall contain the
name and address of the person to whom the extension of credit is made, the amount
thereof, the nature or purpose thereof and the date thereof;
<br />
<br />
• A record of each advice, request or instruction received or given regarding any
transaction resulting (or intended to result and later canceled if such a record is
normally made) in the transfer of currency or other monetary instruments, funds,
checks, investment securities or credit, of more than $10,000 to or from any person,
account or place outside the U.S.;
<br />
<br />
• A record of each advice, request or instruction given to another financial institution
(which includes broker-dealers) or other person located within or without the U.S.,
regarding a transaction intended to result in the transfer of funds, or of currency, other
monetary instruments, checks, investment securities or credit, of more than $10,000
to a person, account or place outside the U.S.;
<br />
<br />
• Each document granting signature or trading authority over each customer's account;
<br />
<br />
• Each record described in Exchange Act Rule 17a-3(a): (1) (blotters), (2) (ledgers for
assets and liabilities, income, and expense and capital accounts), (3) (ledgers for cash
and margin accounts), (4) (securities log), (5) (ledgers for securities in transfer,
dividends and interest received, and securities borrowed and loaned), (6) (order
tickets), (7) (purchase and sale tickets), (8) (confirms), and (9) (identity of owners of
cash and margin accounts);
<br />
<br />
• A record of each remittance or transfer of funds, or of currency, checks, other
monetary instruments, investment securities or credit, of more than $10,000 to a
person, account or place, outside the U.S.; and
<br />
<br />
• A record of each receipt of currency, other monetary instruments, checks or
          investment securities and of each transfer of funds or credit, of more than $10,000
          received on any one occasion directly and not through a domestic financial
          institution, from any person, account or place outside the U.S.
        </p>
        <h5 className="legal-content">15.
Training Programs</h5>
        <p className="legal-content">
        We will develop ongoing employee training under the leadership of the AML
Compliance Person and senior management. Our training will occur on at least an annual
basis. It will be based on our firm’s size, its customer base, and its resources and be
updated as necessary to reflect any new developments in the law.
<br />
<br />
Our training will include, at a minimum: (1) how to identify red flags and signs of money
laundering that arise during the course of the employees’ duties; (2) what to do once the
risk is identified (including how, when and to whom to escalate unusual customer activity
or other red flags for analysis and, where appropriate, the filing of SARs); (3) what
employees' roles are in the firm's compliance efforts and how to perform them; (4) the
firm's record retention policy; and (5) the disciplinary consequences (including civil and
criminal penalties) for non-compliance with the BSA.
<br />
<br />
We will develop training in our firm, or contract for it. Delivery of the training may
include educational pamphlets, videos, intranet systems, in-person lectures and
explanatory memos. We will maintain records to show the persons trained, the dates of
training and the subject matter of their training.
<br />
<br />
We will review our operations to see if certain employees, such as those in compliance,
margin and corporate security, require specialized additional training. Our written
procedures will be updated to reflect any such changes.
        </p>
        <h5 className="legal-content">16.
Program to Independently Test AML Program</h5>
<p className="legal-content">The testing of our AML program will be performed at least annually (on a calendar year
basis) [or if a firm is eligible, the firm may state “every two calendar years”] by Torres,
an independent third party. We will evaluate the qualifications of the independent third
party to ensure they have a working knowledge of applicable requirements under the
BSA and it's implementing regulations. Torres also has [describe background in more
detail]. Independent testing will be performed more frequently if circumstances warrant.</p>
<h5 className="bleeding">b.
Evaluation and Reporting</h5>
<p className="legal-content">After we have completed the independent testing, staff will report its findings to senior
        management [or to an internal audit committee]. We will promptly address each of the
resulting recommendations and keep a record of how each noted deficiency was resolved.</p>
<h5 className="legal-content">17.
Monitoring Employee Conduct and Accounts</h5>
        <p className="legal-content">Although we presently have no employees, in the future we will subject employee
accounts to the same AML procedures as customer accounts, under the supervision of the
AML Compliance Person. We will also review the AML performance of supervisors, as
part of their annual performance review. The AML Compliance Person’s accounts will be
reviewed by another member of senior management.</p>
        <h5 className="legal-content">18.
Confidential Reporting of AML Non-Compliance</h5>
<p className="legal-content">Employees will promptly report any potential violations of the firm’s AML compliance
        program to the AML Compliance Person, unless the violations implicate the AML
        Compliance Person, in which case the employee shall report to [the president/chairman
        of the board/audit committee chair]. Such reports will be confidential, and the employee
will suffer no retaliation for making them.</p>
<h5 className="legal-content">19.
Additional Risk Areas</h5>
<p className="legal-content">The firm has reviewed all areas of its business to identify potential money laundering
risks that may not be covered in the procedures described above.</p>     
<h5 className="legal-content">20.
Senior Manager Approval</h5>
<p className="legal-content">Senior management has approved this AML compliance program in writing as
reasonably designed to achieve and monitor our firm’s ongoing compliance with the
requirements of the BSA and the implementing regulations under it. This approval is
indicated by signatures below.</p>
      
      </div>
    );
    const cookiesPolices = (
      <div>
        <p className="legal-content">
          This Cookies Policy explains how Diginet LLC and its trader mark
          DollarBTC use cookies and similar technologies when you visit our
          websites located at www.dollarbtc.com, when you interact with
          DollarBTC online advertisements or emails from marketing. Within the
          Cookies Policy is explained what these technologies are and why we use
          them, as well as their rights to control their use.
          <br />
          <br />
          In some cases, we may use cookies and similar technologies to collect
          personal information, or information that becomes personal information
          if we combine it with other information. In such cases, the DollarBTC
          Privacy Policy will apply in addition to this Cookie Policy. If you
          have any questions about our use of cookies or other technologies,
          please send an email to admin@dollarbtc.com.
        </p>
        <h5 className="legal-content">What are cookies?</h5>
        <p className="legal-content">
          Cookies are small files, usually letters and numbers, that are
          downloaded to your computer or mobile device when you visit certain
          websites. When you return to these websites or visit other websites
          that use the same cookies, the websites recognize these cookies and
          your browsing device. A cookie can not read data from your hard drive
          or read cookie files created by other websites.
          <br />
          <br />
          The cookies established by the operator of the website are called
          “originating cookies”. Cookies established by third parties that are
          not the operator of the website are called “third-party cookies”. The
          parties that configure third-party cookies can recognize your computer
          both when you visit the DollarBTC website and when you visit other
          websites.
          <br />
          <br />
          We treat information collected by cookies and other technologies as
          non-personal information. However, to the extent that IP addresses or
          similar identifiers are considered personal information in accordance
          with local laws, we also treat these identifiers as personal
          information. If we combine non-personal information with personal
          information, the combined information will be treated as personal
          information as long as it remains combined.
          <br />
          <br />
          More information about cookies and their use can be found at
          www.aboutcookies.org or www.allaboutcookies.org
        </p>
        <h5 className="legal-content">Why do we use cookies?</h5>
        <p className="legal-content">
          When you access our Services, we may place cookies on your computer or
          other device. These technologies help us to better understand the
          behavior of users and inform us about what parts of our websites
          people have visited.
          <br />
          <br />
          We use our own and third party cookies to recognize you as a customer
          of DollarBTC, customize the Services, content and advertising of
          DollarBTC, measure the promotional effectiveness and collect
          information about your computer or other access device to mitigate the
          risk, help to prevent fraud and promote trust and security.
          <br />
          <br />
          We may place cookies from third-party service providers that may use
          information about your visits to other websites to target
          advertisements for products and services available at DollarBTC. We do
          not control the types of information collected and stored by these
          third-party cookies. You should check the third-party website for more
          information on how they use cookies.
          <br />
          <br />
          We may use the non-personal information collected as follows: we may
          collect and store details of how you use our Services. Except in
          limited cases to guarantee the quality of our Services through the
          Internet, this information will not be associated with your IP
          address.
          <br />
          <br />
          We may collect information such as your language, zip code, area code,
          unique device identifier, reference URL, location and time zone so
          that we can better understand the customer’s behavior and improve our
          Services.
          <br />
          <br />
          We may collect information about customer activities on our website,
          which is used to understand which parts of our Sites and Services are
          of most interest. These data are aggregated and, therefore, are
          considered non-personal information for the purposes of this Privacy
          Policy.
        </p>
      </div>
    );
    const documents = (
      <div>
        <p className="legal-content">
          <a href={certificate} target="_blank" rel="noopener noreferrer">
            Certificate of Organization Diginet Llc.pdf
          </a>
        </p>
        <p className="legal-content">
          <a href={curriculum} target="_blank" rel="noopener noreferrer">
            Diginet LLC Curriculum.pdf
          </a>
        </p>
      </div>
    );

    const item1 = (
      <div>
        {/* <h5 className="legal-content">1. Our relationship with you</h5> */}
        <p className="bleeding">
          <li>
            or 1.1 Diginet.llc is a licensed and registered money transmitter
          </li>
        </p>
        <p className="legal-content">
          As a registered and licensed Money Transmitter, Diginet.llc sells and
          buys digital currency from third parties and then resells it and / or
          purchases its digital currency in exchange for a currency backed by
          Fiat Sovereignas USD. If you violate any part of our terms, we have
          the right to refuse your transaction and prohibit you from using our
          Service indefinitely without reason or explanation.
        </p>
        <p className="bleeding">
          <li>or 1.2 Your privacy</li>
        </p>

        <p className="legal-content">
          Protecting your privacy is very important for Diginet.llc. Review our
          Privacy Policy to better understand our commitment to maintain your
          privacy, as well as our use and disclosure of your Information.
        </p>
        <p className="bleeding">
          <li>1.3 Privacy of others</li>
        </p>
        <p className="legal-content">
          If you receive information about another user through the Diginet.llc
          services, you must keep the information confidential and only use it
          in relation to the Diginet.llc services. You may not disclose or
          distribute a user's information to a third party or use the
          information for marketing purposes unless you receive the user's
          express consent to do so.
        </p>
        <p className="bleeding">
          <li>or 1.4 Intellectual property</li>
        </p>
        <p className="legal-content">
          " Diginet.llc ", and all logos related to the Services of Diginet.llc
          are trademarks or registered trademarks of Diginet.llc or its
          licensors. You may not copy, imitate or use them without the prior
          written consent of Diginet.llc. In addition, all page headers, custom
          graphics, button icons and scripts are service marks, trademarks and /
          or commercial image of Diginet.llc. You may not copy, imitate or use
          them without our prior written consent. All rights, titles and
          interests in and for the Diginet.llc website, any content in this
          regard, the Diginet.llc Services, the technology related to the
          Diginet.llc Services and all technology and any content created or
          derived from any of the above is the exclusive property of Diginet.llc
          and its licensors.
        </p>
        <p className="bleeding">
          <li>1.5 Assignment</li>
        </p>
        <p className="legal-content">
          You may not transfer or assign any rights or obligations under this
          Agreement without the prior written consent of Diginet.llc.
          Diginet.llc reserves the right to transfer or assign this Agreement or
          any right or obligation under this Agreement at any time.
        </p>
        <p className="bleeding">
          <li>or 1.6 Notices for you</li>
        </p>
        <p className="legal-content">
          You agree that Diginet.llc can provide you with a notice by posting it
          on our website, sending it by email to the email address listed on
          your Account or by sending it by mail to the address listed on your
          Account. Such notification will be deemed received by you within 24
          hours after publication on our website or will be sent to you by email
          unless we receive a notification that the email was not delivered. If
          the notification is sent by mail, we will consider that you received
          it three business days after it was sent. You may request a paper copy
          of any legally required disclosure and may terminate your consent to
          receive such disclosure through electronic communications by
          contacting Diginet.llc as described in section 1.7 below. Diginet.llc
          will charge you a registration request fee (according to section 8) to
          provide a paper copy.
        </p>
        <p className="bleeding">
          <li>or 1.7 Notices to Diginet.llc</li>
        </p>
        <p className="legal-content">
          Unless otherwise indicated below, the notification to Diginet.llc must
          be sent by mail to: 2646 Chancellor way Duluth. Ga 30096, United
          States and electronically to info@dollarbtc.com.
        </p>
        <p className="bleeding">
          <li>or 1.8 Calls and text messages to you; Mobile phone numbers</li>
        </p>
        <p className="legal-content">
          By providing Diginet.llc with a telephone number (including a cordless
          / cellular telephone), you agree to receive calls from pre-recorded
          and dialed messages or SMS text messages related to the Diginet.llc
          Services at that number. If we determine that a telephone number you
          have provided to us is a mobile telephone number, we may classify it
          as such in our systems and in your Profile.
        </p>
      </div>
    );
    const item2 = (
      <div>
        {/* <h5 className="legal-content">2. Accounts</h5> */}
        <p className="legal-content">
          To use some of our Services, you must create an account with
          Diginet.llc ("Account") or provide sufficient information so that we
          can verify your identity each time you use the Services. If you create
          an Account, you agree to: (a) provide accurate, truthful and current
          information when creating an Account or when using one of our POS or
          Web Services; (b) use your Account and Services only for you, do not
          share access with others and do not make transactions for others; and
          (c) notify us immediately if you discover or suspect any breach of
          security or misuse related to your account
        </p>
        <p className="bleeding">
          <li>or 2.1 Eligibility</li>
        </p>
        <p className="legal-content">
          To be eligible for Diginet.llc Services, you must be at least 18 years
          old and a resident of the United States. This Agreement applies only
          to Users who are residents of the United States. By using the
          Services, you declare and warrant that (a) you are of legal age to
          form a binding contract; (b) the use of our Services has not been
          previously suspended or eliminated; (c) have full power and authority
          to enter into this agreement and, in doing so, will not violate any
          other agreement of which you are a party; (d) are under control or are
          nationals or residents of any country to which the United States has
          seized goods or services; (e) have not been identified as a "Specially
          Designated National" by the United States Office of Foreign Assets
          Control; and (f) have not been included in the List of Denied Persons
          of the US Department of Commerce. UU.
        </p>
        <p className="bleeding">
          <li>or 2.2 Identity authentication</li>
        </p>
        <p className="legal-content">
          You authorize Diginet.llc, directly or through third parties, to make
          any queries we deem necessary to validate your identity. This may
          include asking you for more information, asking you to provide a
          taxpayer identification number, requiring you to take steps to confirm
          ownership of your email address or financial instruments, requesting a
          credit report or verifying your information in third-party databases.
          or through other sources. Before using the Services, you must provide
          all the information requested by Diginet.llc in the POS or Web
          Service, the location of the POS or Web Service by a representative of
          Diginet.llc, Site or mobile application, which may include, among
          others: name, address, date of birth, social security number, driver's
          license or other photo identification issued by the government
          ("Personal Information"). You acknowledge that Diginet.llc, or one of
          its agents or employees or POS or Web Services, will analyze and
          validate your identity by reference to Personal Information to
          determine if you qualify to use the Services ("Verification Process").
          Your use of the Services may be delayed during the Verification
          Process, and Diginet.llc disclaims liability for any loss, delay or
          other damage related thereto. If you do not approve the Verification
          Process, or if you do not provide the information required to access
          the Services, you will be denied access to the Services. If you
          believe that your access to the Services has been denied in error,
          contact us in Your use of the Services may be delayed during the
          Verification Process, and Diginet.llc disclaims liability for any
          loss, delay or other damage related thereto. If you do not approve the
          Verification Process, or if you do not provide the information
          required to access the
        </p>
        <p className="legal-content">
          Services, you will be denied access to the Services. If you believe
          that your access to the Services has been denied in error, contact us
          in Your use of the Services may be delayed during the Verification
          Process, and Diginet.llc disclaims liability for any loss, delay or
          other damage related thereto. If you do not approve the Verification
          Process, or if you do not provide the information required to access
          the Services, you will be denied access to the Services. If you
          believe that your access to the Services has been denied in error,
          contact us at info@dollarbtc.com
        </p>
        <p className="bleeding">
          <li>or 2.3 Third party permissions</li>
        </p>
        <p className="legal-content">
          If you grant express permission to a third party to take specific
          measures on your behalf or access particular information about your
          Account, either through the use of the third party's product or
          service or through the API Access, you acknowledge that Diginet.llc
          may disclose the information about your account that is specifically
          authorized by you to this third party. You also acknowledge that
          granting permission to a third party to take specific measures on your
          behalf does not relieve you of any of your responsibilities under
          thisAgreement. In addition, you acknowledge and agree that you will
          not hold Diginet.llc responsible and that you will indemnify
          Diginet.llc for any liability arising from actions or omissions in
          relation to the permits you grant.
        </p>
      </div>
    );
    const item3 = (
      <div>
        {/* <h5 className="legal-content">3. Minutes</h5> */}
        <p className="legal-content">
          POS or Web Service and physical agent transactions
        </p>
        <p className="legal-content">
          The following terms apply to any purchase or sale of virtual currency
          made through a POS or Web Service or physical agent location (each, an
          "order").
        </p>
        <p className="bleeding">
          <li>or 3.1 Order information</li>
        </p>
        <p className="legal-content">
          You must provide all information requested by Diginet.llc through the
          POS or Web Service in relation to any Order, including: (a) for
          Purchase Orders, the amount of US dollars that you intend to spend in
          connection with the purchase and the address of the virtual currency
          wallet to which Diginet.llc send the virtual currency you buy; and (b)
          for sales orders, the amount of virtual currency that you intend to
          sell. You are solely responsible for the accuracy of any order
          information you submit.
        </p>
        <p className="bleeding">
          <li>3.2 Terms of the offer</li>
        </p>
        <p className="legal-content">
          When you place an Order, you can see the specific terms and conditions
          applicable to your Order, which will include: (i) a price at which
          Diginet.llc will buy or sell the virtual currency, which includes all
          applicable rates and (ii) only for sales transactions, the expiration
          time of the Offer, which is the deadline on which Diginet.llc or its
          designated agent must receive the virtual currency that you wish to
          sell to Diginet.llc. Only for sales transactions, you will be shown
          the Terms of the offer that also contain a QR code with the virtual
          currency payment address of Diginet.llc and a cash exchange code that
          is activated subject to compliance with the conditions established in
          Section 2.3 (b) below ("Sale Ticket").
        </p>
        <p className="bleeding">
          <li>or 3.3 Order completion</li>
        </p>
        <p className="legal-content">
          To accept the offer of Diginet.llc to buy or sell virtual currency,
          you must comply with the terms and conditions established in the Terms
          of the Offer, including, among others, the requirements detailed
          below. (to) Purchase order completion. To complete your purchase of
          virtual currency of Diginet.llc in accordance with the applicable
          Terms of the Offer, you must insert cash in the POS or Web Service to
          pay Diginet.llc, with which Diginet.llc will send the amount of
          virtual currency calculated by the type of change specified in the
          Terms of the Offer to the virtual address of the monetary wallet that
          you provide within a reasonable period; However, we cannot guarantee
          that the virtual currency will be transmitted to your address within a
          specific period. (b) Finalization of the sales order. To complete your
          virtual currency sale to Diginet.llc in accordance with the applicable
          Offer Terms, the following must occur: (i) you must send the virtual
          currency to the virtual currency address that we designate in the
          Terms of the Offer (“ Payment address ”), (ii) Diginet.llc or its
          designated agent, must confirm receipt of said virtual currency before
          the expiration time of the offer provided in the Terms of the Offer
          expires If the above steps are completed successfully and all other
          Terms of the Offer are met, the agent's location will provide US
          dollars in the amount specified in the Offer Terms or the POS or Web
          Service will disburse cash in the amount of US dollars specified in
          the Offer Terms when sending the Diginet.llc required to the QR code
          of Diginet.llc shown in the POS or Web Service. If you do not meet all
          the requirements described in the applicable Offer Terms, Diginet.llc
          will not be subject to these Offer Terms and the original Order will
          be canceled. For example, your Order will be canceled if the deadline
          provided in the Terms ofthe offer expires before it meets the steps
          described in this Section 2.3. If you send an incorrect amount of
          virtual currency to the Payment Address, this constitutes a new offer
          to Diginet.llc, replacing the existing Offer Terms; and Diginet.llc,
          at its sole discretion, can cancel the order and return all virtual
          currency that it sent in the form of a paper wallet or back to the
          original address from which it sent the bitcoin, net of any network or
          transaction fee , or accept your new offer as follows: (i) if you send
          more virtual currency to the Payment Address than specified in the
          Terms of the offer, Diginet.llc will respect the Terms of the offer
          and disburse the excess amount of currency virtual to the address from
          which you originally sent the bitcoin, net of any network or
          transaction fee; or (ii) if you send less virtual currency to the
          Payment Address than the one specified in the Terms of the offer,
          Diginet.llc will round your offer as necessary to the nearest entry in
          the Rate Table in effect at that time and disburse the excess amount
          of virtual currency to the address from which you originally sent the
          bitcoin, net of any network or transaction fee. If your sales order is
          canceled for any reason and you have sent a virtual currency to
          Diginet.llc your virtual currency will be returned (net of any network
          and transaction fees) to the address from which you originally sent
          the bitcoin; However, we cannot guarantee that the virtual currency
          will be transmitted to your address within a specific period. If your
          purchase order is canceled and you have inserted US dollars into the
          POS or Web Service, info@dollarbtc.com immediately. You are
          responsible for remaining physically present at the POS or Web Service
          to receive cash, receipts or paper wallets, or to enter any required
          information. Diginet.llc is not responsible for your failure to
          receive US dollars or virtual currencies returned or disbursed in
          accordance with these terms.
        </p>
        <p className="bleeding">
          <li>or 3.4 Receipts</li>
        </p>
        <p className="legal-content">
          Upon completing a purchase transaction, you will be provided with a
          paper wallet containing your virtual currency, or the virtual currency
          will be transferred to your designated virtual currency address, and
          if you will receive a text containing the Terms of the Offer and the
          actual amount of virtual currency purchased at Diginet.llc. When
          placing a sales order, you will be provided with a QR code on the POS
          or Web Service screen as mentioned above that contains the address of
          the Diginet.llc wallet to which you need to send the bitcoin to which
          you want to sell. After Diginet.llc has received your virtual
          currency, and after Diginet.llc has delivered US dollars through one
          of our POS or Web Services, you will receive an SMS text message to
          your phone number containing the Terms of the offer and the amount of
          US dollars delivered to you.
        </p>
        <p className="legal-content">Online transactions</p>
        <p className="legal-content">
          Transactions can be made online twenty-four (24) hours a day, seven
          (7) days a week or by a POS or Web Service physically or physically at
          an authorized agent / distributor during the specified hours
          available. All transactions will be confirmed in the order in which
          they were sent.
        </p>
        <p className="legal-content">
          Upon confirmation, an email or text message will be sent to the
          Client. Diginet.llc encourages all Customers to log into their
          Diginet.llc. Account within twelve (12) hours after the start of a
          purchase or sale transaction to verify the status of the transaction
          and review all payment procedures or transaction history.
        </p>
        <p className="bleeding">
          <li>3.5 Purchase restrictions</li>
        </p>
        <p className="legal-content">
          We may, at our discretion, impose limits on the amount of money you
          can buy, sell or send through the Diginet.llc Services, including
          money you send for purchases. You can see yourspending limit by
          logging into your account. Diginet.llc reserves the right to
          unilaterally modify existing restrictions or implement new
          restrictions without notice at any time.
        </p>
        <p className="bleeding">
          <li>or 3.6 Price confirmations for customer purchase transactions</li>
        </p>
        <p className="legal-content">
          An estimated price is displayed at the time a Customer Purchase
          Transaction is sent. However, the price at the time a transaction is
          sent may be subject to market fluctuations. Diginet.llc, at its sole
          discretion, may choose to require a Customer to have a portion of the
          planned purchase price, or the total planned purchase price, in
          cleared funds, before placing an order. If a Customer wishes to cancel
          at any time after the transaction has been completed at a POS or Web
          Service, the Customer may be responsible for cancellation fees as
          described in this agreement. If a Customer wishes to cancel at any
          time before a transaction has been completed online, the Customer may
          be responsible for cancellation fees as described in this agreement.
        </p>
        <p className="bleeding">
          <li>or 3.7 Price confirmations for customer sales transactions</li>
        </p>
        <p className="legal-content">
          A price is confirmed at the time a Customer Sale Transaction is sent
          (both online and by phone). The price at the time a transaction is
          sent will be blocked, regardless of market fluctuations. Diginet.llc,
          at its sole discretion, may choose to prevent a Customer Sale
          Transaction from being canceled, for a period of up to twenty-four
          (24) hours to allow another customer to send payment. The Client, by
          accepting these Terms and Conditions, acknowledges that Diginet.llc
          will not be responsible for potential losses incurred due to market
          fluctuations during this period.
        </p>
      </div>
    );
    const item4 = (
      <div>
        {/* <h5 className="legal-content">4. Payment</h5> */}
        <p className="bleeding">
          <li>
            or 4.1. Acceptable payment methods - Customer purchase transaction
          </li>
        </p>
        <p className="legal-content2">
          Diginet.llc may choose to accept any of the following payment methods
          for Customer Purchase Transactions:
        </p>
        <p className="bleeding2">
          <li type="circle">Cash</li>
          <li type="circle">ACH through a bank account (online)</li>
          <li type="circle">Debit card (online)</li>
        </p>
        <p className="legal-content2">
          Diginet.llc reserves the right to choose to accept or refuse any
          payment method, at any time, at its sole discretion.
        </p>
        <p className="bleeding">
          <li>or 4.2 Revenue from customer sale transactions</li>
        </p>
        <p className="legal-content2">
          The payment options for a customer sale transaction are as follows:
        </p>
        <p className="bleeding2">
          <li type="circle">Cash (POS or Web Service / ATM)</li>
          <li type="circle">ACH through a bank account (online)</li>
          <li type="circle">Debit card (online)</li>
        </p>
        <p className="legal-content">
          Diginet.llc reserves the right to choose to offer or refuse to offer
          any payment method, at any time, at its sole discretion. Some payment
          options may be subject to a service fee, which will be presented to
          the Customer before order confirmation. While Diginet.llc will make a
          great effort to process transactions almost in real time, the
          processing and settlement of Customer Sales Transactions can, in rare
          circumstances, take up to two (2) business days. Due to anti-money
          laundering legislation in the United States, Diginet.llc cannot
          forward the proceeds of any Customer Sale Transaction to a person
          other than the owner or holder of a designated account.
        </p>
        <p className="bleeding">
          <li>4.2.1 Commercial account payments</li>
        </p>
        <p className="legal-content">
          Any payment of a customer sale transaction in a business account can
          be made only with the business name. For individual companies, payment
          can be made in the name of the business or sole proprietor, provided
          that proper authorization documentation has been received.
        </p>
      </div>
    );
    const item5 = (
      <div>
        {/* <h5 className="legal-content">5. Transaction Cancellations</h5> */}
        <p className="legal-content">
          When canceling a transaction, reimbursements for market losses may
          apply, since a submitted transaction constitutes a binding agreement
          between Diginet.llc and the Client.
        </p>
        <p className="bleeding">
          <li>or 5.1. Customer purchase transactions</li>
        </p>
        <p className="legal-content">
          In the event that a Customer Purchase Transaction is canceled (either
          by the Customer or by Diginet.llc for not receiving the full payment
          within the time stipulated above), the Customer must pay the payments
          for losses of the market to Diginet.llc. This rate is calculated based
          on whether there has been a loss in market value from the moment the
          price of a transaction sent is confirmed until the moment a
          transaction is canceled. In case of market gain, no cancellation fee
          will apply. In no case Diginet.llc is responsible for paying the
          Client for changes in the underlying market price.
        </p>
      </div>
    );
    const item6 = (
      <div>
        {/* <h5 className="legal-content">6. Account balances</h5> */}
        <p className="bleeding">
          <li>or 6.1 Online balances</li>
        </p>
        <p className="legal-content">
          Diginet.llc currently does not provide the ability to keep funds
          online. If we choose to do so in the future, if you maintain a Bitcoin
          Balance online with Diginet.llc, Diginet.llc will keep your funds
          separate from your corporate funds and will not use your funds for
          your operating expenses or any other corporate purpose and will not do
          voluntarily your funds available to your creditors in case of
          bankruptcy.
        </p>
        <p className="bleeding">
          <li>or 6.2 Assignment of interest to Diginet.llc</li>
        </p>
        <p className="legal-content">
          You agree that you will not receive interest or other earnings on the
          funds that Diginet.llc manages as your agent. In consideration of your
          use of the Services of Diginet.llc, you irrevocably transfer and
          assign to Diginet.llc any property rights you may have over any
          interest that may accrue on the funds withheld. This allocation
          applies only to interest earned on your funds, and nothing in this
          Agreement gives Diginet.llc any ownership rights over the capital of
          the funds held with Diginet.llc. In addition to or instead of earning
          interest, Diginet.llc may receive a reduction in fees or expenses
          charged for the banking services of banks that maintain their funds
        </p>
        <p className="bleeding">
          <li>or 6.3 Compensation of past due amounts</li>
        </p>
        <p className="legal-content">
          If you have an overdue amount due to Diginet.llc or a subsidiary,
          subsidiary or parent company of Diginet.llc, Diginet.llc you can debit
          from your Account to pay any overdue amount more than 180 days.
        </p>
        <p className="bleeding">
          <li>or 6.4 Security interest</li>
        </p>
        <p className="legal-content">
          To ensure compliance with this Agreement, you grant Diginet.llc a
          right of retention and security interest over the funds held in your
          Account in the possession of Diginet.llc.
        </p>
        <p className="bleeding">
          <li>or 6.5 Request a refund of your balance</li>
        </p>
        <p className="legal-content">
          At any time, you can request that your balance be refunded. Your
          balance may be refunded by physical check or by moving your balance to
          your Diginet.llc debit card (if applicable) or other acceptable means
          of payment. In general, only to your main billing address. We will not
          send checks to post office boxes. If you would like us to send a check
          to an address other than your Primary Billing Address, you must
          contact Customer Service and provide the documentation we request to
          verifyyour association with the address. If you cannot cash a check
          within 180 days after the date of issuance, we will refund the funds
          to your Online Balance (minus a fee).
        </p>
      </div>
    );
    const item7 = (
      <div>
        {/* <h5 className="legal-content">7. Close your account</h5> */}
        <p className="bleeding">
          <li>or 7.1 How to close your account</li>
        </p>
        <p className="legal-content">
          You can close your Account at any time by contacting Customer Service,
          which can be accessed online through the Diginet.llc customer portal
          at any time, or by sending an email to info@dollarbtc.com
        </p>
        <p className="bleeding">
          <li>or 7.2 Limitations to close your account</li>
        </p>
        <p className="legal-content">
          You cannot close your account to evade an investigation. If you
          attempt to close your account while we are conducting an
          investigation, we may withhold funds up to 180 days to protect
          Diginet.llc or a third party against the risk of reversals,
          chargebacks, claims, fees, fines, penalties and other liabilities. You
          will remain responsible for all obligations related to your Account,
          even after the Account is closed.
        </p>
        <p className="bleeding">
          <li>7.3 Withdrawal of inactive accounts</li>
        </p>
        <p className="legal-content">
          If you do not log into your Account for two or more years, Diginet.llc
          can close your Account and send the Balance to your main address or,
          if necessary, cancel your Balance to your state of residence.
          Diginet.llc will determine your residence based on the state in your
          main address. If your address is unknown or registered as a foreign
          country, your funds will go to the state of Florida. When applicable,
          Diginet.llc will send you a notice before canceling or closing your
          Account. If you do not respond to this notice, your balance will be
          transferred to the state. If you wish to claim your state funds,
          contact the Unclaimed Property Administrator in your state.
        </p>
      </div>
    );
    const item8 = (
      <div>
        {/* <h5 className="legal-content">8. Rate</h5> */}
        <p className="legal-content">
          The following section describes all the fees that Diginet.llc can
          charge the Client in relation to the digital currency exchange and
          payment products. Unless otherwise specified, all rates indicated are
          in US dollars. A transaction made in other currencies will be
          converted based on the exchange rate of the US dollar at the time the
          transaction is sent.
        </p>
        <p className="bleeding">
          <li>or 8.1 Verification fee</li>
        </p>
        <p className="legal-content">
          Diginet.llc may, at its discretion, charge a single verification fee
          to enroll customers for the first time on its KYC platform or on a
          third-party KYC platform that will verify the sanctions lists. This
          charge will never exceed more than $ 2.00. This verification fee is
          non-refundable. By using the website or any POS or Web Service or
          Diginet.llc Service, you acknowledge the existence of the verification
          fee and agree that the fee is not refundable under any circumstances.
        </p>
        <p className="bleeding">
          <li>or 8.2 Exchange service fee</li>
        </p>
        <p className="legal-content">
          A service fee is applied to all exchange transactions and the rate
          will be communicated to the Customer prior to the confirmation of the
          transaction. The value of the transaction and the administrative fee
          are calculated / quoted in USD for transactions in US dollars, and can
          be calculated / quoted in USD equivalents for transactions in all
          other currencies, or in the currency of the transaction. The rate will
          be a flat rate or a percentage of the amount of the transaction.
        </p>
        <p className="bleeding">
          <li>8.3 Bitcoin storage, liability and maintenance fee</li>
        </p>
        <p className="legal-content">
          The customer may be charged a storage fee of .025% of the balance of
          his account per month for any currency stored with Diginet.llc more
          than seven days after purchase. To avoid this rate, Customers can
          transfer digital currency to a non-Diginet.llc wallet within seven
          days after purchase.
        </p>
      </div>
    );
    const item9 = (
      <div>
        {/* <h5 className="legal-content">9. Risk</h5> */}
        <p className="bleeding">
          <li>9.1 Tips</li>
        </p>

        <p className="legal-content">
          Diginet.llc has not offered or given and will not provide any
          investment advice in relation to any Customer Purchase Transaction or
          Customer Sale Transaction and has not offered or given any opinion
          regarding the suitability of any transaction made or that may Perform
          the Client. The Client guarantees that Diginet.llc has not offered or
          given any investment advice to the Client in relation to the products
          and services offered by Diginet.llc. In addition, Diginet.llc has not
          given the Client any opinion regarding the suitability of any of its
          products or services for the Client.
        </p>
        <p className="bleeding">
          <li>or 9.2 Market risk</li>
        </p>
        <p className="legal-content">
          Clients should carefully consider the suitability of the digital
          currency as an investment option before making any decision that may
          affect their financial situation. Digital currency balances are not
          insured by the Federal Deposit Insurance Corporation, National Credit
          Union Share Insurance Fund or other similar program and may lose
          value. The purchase and sale of digital currency implies a high degree
          of risk and is not suitable for all people. The purchase and sale of
          digital currency does not offer interest, performance or return
          guarantee. Losses may be incurred both as a result of price
          devaluation and if the price gains do not exceed the applicable rates,
          including those charged here. The Client has read and understands
          these Terms and Conditions and recognizes that any risk of diminishing
          the market value of any digital currency is the Client's risk and not
          that of Diginet.llc. If the Client has any doubt about the suitability
          of the digital currency as an investment, he should contact an
          independent legal or financial advisor.
        </p>
      </div>
    );
    const item10 = (
      <div>
        {/* <h5 className="legal-content">10. Rules of behavior</h5> */}
        <p className="bleeding">
          <li>or 10.1 Restricted activities</li>
        </p>
        <p className="legal-content">
          In connection with your use of our website, POS or Web Service, any
          other Diginet.llc service or in the course of your interactions with
          Diginet.llc, other users or third parties, you do not:
        </p>
        <p className="bleeding2">
          1. Breach this Agreement, the Commercial Entity Agreement, the
          Acceptable Use Policy or any other agreement or policy that you have
          agreed with Diginet.llc
        </p>
        <p className="bleeding2">
          2. Violate any law, statute, ordinance or regulation (for example,
          those governing financial services, consumer protection, unfair
          competition, the fight against discrimination or false advertising);
        </p>
        <p className="bleeding2">
          3. Infringe the copyright, patent, trademark, trade secret or other
          intellectual property rights of Diginet.llc or third parties, or
          rights of publicity or privacy;
        </p>
        <p className="bleeding2">4. Sell counterfeit products;</p>
        <p className="bleeding2">
          5. Act in a defamatory, defamatory, threatening or harassing manner;
        </p>
        <p className="bleeding2">
          6. Provide false, inaccurate or misleading information;
        </p>
        <p className="bleeding2">
          7. Send or receive what we reasonably believe to be potentially
          fraudulent funds;
        </p>
        <p className="bleeding2">
          8. Refuse to cooperate in an investigation or provide confirmation of
          your identity or any information you provide to us;
        </p>
        <p className="bleeding2">
          9. Attempt double immersion during the course of a dispute by
          receiving or attempting to receive funds from both Diginet.llc and the
          Seller, the bank or the credit card issuer for the same transaction;
        </p>
        <p className="bleeding2">
          10. Control an account that is linked to another account that has
          participated in any of these restricted activities;
        </p>
        <p className="bleeding2">
          11. Conduct your business or use the Services of Diginet.llc in a way
          that generates or can generate complaints, Disputes, Claims,
          Reversals, Chargebacks, fees, fines, penalties and other liability to
          Diginet.llc, other Users, third parties or you;
        </p>
        <p className="bleeding2">
          12. Integrate Diginet.llc services inconsistently with Diginet.llc
          integration guidelines
        </p>
        <p className="bleeding2">
          13. Allow your account to have a negative balance;
        </p>
        <p className="bleeding2">
          14. Reveal or distribute the information of another user to a third
          party, or use the information for marketing purposes unless you
          receive the express consent of the users to do so;{" "}
        </p>
        <p className="bleeding2">
          15. Send unsolicited emails to a User or use the Services of
          Diginet.llc to collect payments for sending or help send unsolicited
          emails to third parties;{" "}
        </p>
        <p className="bleeding2">
          16. Take any action that imposes an unreasonable or disproportionately
          large load on our infrastructure;
        </p>
        <p className="bleeding2">
          17. Facilitate viruses, Trojans, worms or other computer programming
          routines that may damage, harmfully interfere, surreptitiously
          intercept or expropriate any system, data or information;
        </p>
        <p className="bleeding2">
          18. Use any robot, spider, other automatic device or manual process to
          monitor or copy our website without our prior written permission;
        </p>
        <p className="bleeding2">
          19. Use any device, software or routine to avoid our robot exclusion
          headers, or interfere with or attempt to interfere with our website or
          the Diginet.llc Services
        </p>
        <p className="bleeding2">
          20. By accessing and using our Service, you agree that you will not
          violate any law, contract, intellectual property or other third party
          right, nor commit a grievance, and that you are solely responsible for
          your conduct when using our Service. In addition, you agree to comply
          with these Terms and not:
        </p>
        <p className="bleeding2">
          21. Use our Services in any way that may interfere, interrupt,
          negatively affect or inhibit other users from fully enjoying our
          Service, or that may damage, disable, overload or impair the operation
          of our Services in any way, including any damage physical or
          disfigurement of a POS or Web Service;
        </p>
        <p className="bleeding2">
          22. Use our Services to pay, support or otherwise participate in
          illegal activities, including, but not limited to, illegal bets;
          music, movies or other illegally acquired content; sexual orientation
          materials or services; fraud; money laundering; terrorist financing;
          or the purchase or sale of illegal or controlled substances.
        </p>
        <p className="bleeding2">
          23. Use any robot, spider, tracker, scraper or other automated means
          or interface not provided by us to access our services or extract
          data;
        </p>
        <p className="bleeding2">
          24. Use any hardware or software to omit, disable or interfere with
          the Services or the Verification Process;
        </p>
        <p className="bleeding2">
          25. Use or attempt to use another user's account without
          authorization;
        </p>
        <p className="bleeding2">
          26. Try to avoid the content filtering techniques we use, or try to
          access any Service or area of our Services that is not authorized;
        </p>
        <p className="bleeding2">
          27. Develop or implement third-party applications, software or
          hardware that interact with our Services without our prior written
          consent;
        </p>
        <p className="bleeding2">
          28. Provide false, inaccurate or misleading information; Y
        </p>
        <p className="bleeding2">
          29. Encourage or induce a third party to participate in any of the
          activities prohibited under these Terms of Sale.
        </p>
        <p className="bleeding2">
          30. Take any action that may cause us to lose any of the services of
          our Internet service providers, payment processors or other providers;
        </p>
        <p className="bleeding2">
          31. Scan a QR code of a Bitcoin public key address for which you do
          not have private keys.
        </p>
      </div>
    );
    const item11 = (
      <div>
        {/* <h5 className="legal-content">
          11. Your responsibility: actions we can take and our limitation of
          liability
        </h5> */}
        <p className="bleeding">
          <li>11.1 Compliance and due diligence</li>{" "}
        </p>
        <p className="legal-content">
          The Client is responsible for complying with all the laws of the
          jurisdiction from which he accesses the Diginet.llc Website, the
          Diginet.llc POS or Web Services or the Diginet.llc Services and the
          Client shall at all times be solely responsible for obtaining the
          authorizations required by any authorized body in that jurisdiction.
          The Client has carried out a reasonable due diligence to ensure that
          the purchase and sale of digital currency in accordance with these
          Terms and Conditions is not contrary to any law or regulation of the
          jurisdiction that governs the Client, and that the acceptance of these
          Terms and Conditions by the Customer The Customer and the conclusion
          of a Customer Purchase Transaction or Customer Sale Transaction is not
          contrary to any federal, provincial, state or other law or regulation
          applicable to the Customer.
        </p>
        <p className="bleeding">
          <li>or 11.2 Protection of electronic identification information</li>
        </p>
        <p className="legal-content">
          It is the client's obligation to ensure that their electronic
          identification information is kept secret. The Client agrees to keep
          his Electronic Identification Information and all its components
          secret and secure to avoid unauthorized use.
        </p>
        <p className="bleeding">
          <li>or 11.3 Notification</li>
        </p>
        <p className="legal-content">
          If a Customer believes that any transaction or balance registered in
          their account is incorrect, the Customer should contact Diginet.llc
          immediately to notify Diginet.llc about the possible unauthorized use
          of the Customer's electronic Identification Information. Customers are
          responsible for ensuring the accuracy of the information shown in
          their account, regardless of how they access. Diginet.llc will not be
          liable in the event that a Client does not disclose the unauthorized
          use of the electronic Identification Information and the Diginet.llc
          accounts of the Client.
        </p>
        <p className="bleeding">
          <li>or 11.4 Your responsibility</li>
        </p>
        <p className="legal-content">
          You are responsible for all reversals, chargebacks, claims, fees,
          fines, penalties and other liabilities incurred by B Diginet.llc a
          user or a third party caused by your breach of this Agreement and / or
          your use of Diginet.llc Services . You agree to reimburse Diginet.llc
          to a User or a third party for any liability. or 11.5 Temporary
          withholdings for disputed transactions
        </p>
        <p className="bleeding">
          <li>or 11.5 Temporary withholdings for disputed transactions</li>
        </p>
        <p className="legal-content">
          If a User files a dispute in a transaction in which you were a party,
          Diginet.llc may temporarily suspend the funds in his Account to cover
          the amount of liability. If you win the dispute, Diginet.llc will lift
          the temporary suspension. If you lose the dispute, Diginet.llc will
          remove the funds from your Balance.
        </p>
        <p className="bleeding">
          <li>or 11.6 Refund for your responsibility</li>
        </p>
        <p className="legal-content">
          In the event that you are responsible for the amounts due to
          Diginet.llc, Diginet.llc you can immediately remove those amounts from
          your Balance. If you do not have a Balance that is sufficient to cover
          your liability, your Account will have a negative Balance and you will
          be asked to immediately add funds to your Balance to eliminate the
          Negative Balance. If you do not, Diginet.llc may participate in the
          collection efforts to recover such amounts from you.
        </p>
        <p className="bleeding">
          <li>11.7 Shares of Diginet.llc</li>
        </p>
        <p className="legal-content">
          If we have reason to believe that you have participated in restricted
          activities, we can take several measures to protect Diginet.llc, other
          users, third parties or you from reversals, chargebacks, claims, fees,
          fines, penalties and any other liability. The actions we can take
          include, among others, the following:
        </p>
        <p className="bleeding2">
          <li>
            0. We may close, suspend or limit your access to your Account or
            Diginet.llc Services (such as limiting access to any of your Payment
            Methods and / or your ability to send money, make withdrawals or
            delete Financial Information);
          </li>
        </p>
        <p className="bleeding2">
          <li>
            1. We may contact Users who have purchased goods or services,
            contact their bank or credit card issuer, and / or warn other Users,
            law enforcement officers or affected third parties of their actions;
          </li>
        </p>
        <p className="bleeding2">
          <li>
            2. We may update the inaccurate information you provided to us;
          </li>
        </p>
        <p className="bleeding2">
          <li>
            3. We may refuse to provide Diginet.llc Services in the future;
          </li>
        </p>
        <p className="bleeding2">
          <li>
            4. We may retain your funds for up to 180 days if it is reasonably
            necessary to protect against liability risk; Y
          </li>
        </p>
        <p className="bleeding2">
          <li>5. We can take legal action against you.</li>
        </p>
        <p className="legal-content">
          Diginet.llc, at its sole discretion, reserves the right to terminate
          this Agreement, access its website or access the Diginet.llc Services
          for any reason and at any time prior notification and payment to you
          of unrestricted funds They are in your custody. .
        </p>
        <p className="bleeding">
          <li>
            or 11.8 Account closure, service termination or limited account
            access
          </li>
        </p>
        <p className="legal-content">
          If we close your Account or cancel your use of the Diginet.llc
          Services for any reason, we will send you a general notice of our
          actions, however, we do not have to provide the specific reason. If we
          limit access to your Account, we will provide you with a notice of our
          actions and the opportunity to request access restoration, if
          applicable.
        </p>
        <p className="bleeding">
          <li>11.9 Violation of the acceptable use policy: user fines</li>
        </p>
        <p className="legal-content">
          If you violate the Acceptable Use Policy, we may withhold your funds
          for up to 180 days, fine it with up to $ 2,500.00 USD for each
          violation and / or take legal action against you to recover additional
          losses we incur. You acknowledge and agree that a fine of up to $
          2,500.00 USD is currently a reasonable minimum estimate of
          Diginet.llc's damages, taking into account all currently existing
          circumstances, including the ratio of the sum of the damage range to
          Diginet.llc that I could reasonably anticipate and anticipate that
          test. Actual damage can be impractical or extremely difficult.
          Diginet.llc can deduct these fines directly from any Balance in the
          Infringing Account or any other Account you control.
        </p>
        <p className="bleeding">
          <li>or 11.10 Our limitation of liability</li>
        </p>
        <p className="legal-content">
          IN NO EVENT Diginet.llc, OUR DIRECTORS, AFFILIATES, OFFICIALS,
          MEMBERS, EMPLOYEES OR AGENTS OR UNAUTHORIZED ACCESS TO RECORDS,
          PROGRAMS OR SERVICES Diginet.llc. IN NO EVENT SHALL THE ADDED
          LIABILITY OF Diginet.llc ALREADY BE BY CONTRACT, WARRANTY, TORT
          (INCLUDING NEGLIGENCE, IF ACTIVE, PASSIVE OR IMPUTED), PRODUCT
          RESPONSIBILITY, STRICT RESPONSIBILITY OR OTHER THEORY, DERIVED FROM OR
          RELATED TO THE USE INABILITY TO USE THE SITE / MOBILE APPLICATION OR A
          POS OR WEB SERVICE, ANY PURCHASE OR SALE TRANSACTION THAT OCCURS
          THROUGH THE SERVICES, OR THESE TERMS OF SALE, EXCEED THE FEES PAID BY
          YOU IN THE Diginet.llc (IF ANY) 6 MONTHS IMMEDIATE PRIOR TO DATE CLAIM
          THAT OFFERS RISK AT SUCH LIABILITY. THE Diginet.llc PARTIES SHALL HAVE
          NO LIABILITY FOR YOU FOR RIGHT OR RELATIONSHIP WITH ANY INFRINGEMENT
          OF DATA AFFECTING THE SERVICE, POS OR WEB SERVICE OR SYSTEMS
          Diginet.llc IF Diginet.llc HAD PLACED SAFETY PROCEDURES AND COMPLAINTS
          OF COMPLAINT BREACH. Some jurisdictions do not allow the exclusion of
          certain warranties or the limitation or exclusion of liability for
          incidental or consequential damages. Consequently, some of the
          limitations of this section may not apply to you.
        </p>
        <p className="bleeding">
          <li>11.11 Compensation</li>
        </p>
        <p className="legal-content">
          You agree to defend, indemnify and exempt each Party from Diginet.llc
          from any claim, claim, action, damage, loss, cost or expense,
          including, but not limited to, reasonable attorneys' fees that arise
          or are related to (a ) your use of, or conduct in relation to our
          Services, Site, mobile application or any POS or Web Service; (b) your
          violation of these Terms of Sale; or (c) your violation of any right
          of any other person or entity. If you are obliged to indemnify us, we
          will have the right, in our sole discretion, to control any action or
          procedure and determine if we wish to resolve it and, if so, in what
          terms.
        </p>
      </div>
    );
    const item12 = (
      <div>
        {/* <h5 className="legal-content">12. Disputes with Diginet.llc</h5> */}
        <p className="bleeding">
          <li>or 12.1 Contact Diginet.llc first</li>
        </p>
        <p className="legal-content">
          If a dispute arises between you and Diginet.llc, our goal is to know
          and address your concerns and, if we cannot do so to your
          satisfaction, provide you with a neutral and cost-effective means to
          resolve the dispute quickly. Disputes between you and Diginet.llc
          regarding the Diginet.llc Services can be reported to Customer Service
          online through the Diginet.llc Customer Portal at any time or by
          sending an email to info@dollarbtc.com anytime.
        </p>
        <p className="bleeding">
          <li>12.2 Arbitration</li>
        </p>
        <p className="legal-content">
          For any claim (excluding claims for relief by court order or other),
          where the total amount of compensation requested is less than $
          10,000.00 USD, the party requesting the relief can choose to resolve
          the dispute profitably through arbitration binding not based on
          appearance. If a party chooses the arbitration, that party will
          initiate said arbitration through an alternative dispute resolution
          provider (ADR) established mutually agreed by the parties. The ADR
          provider and the parties must comply with the following rules: a) the
          arbitration will be conducted by phone, online and / or based solely
          on written submissions, the party initiating the arbitration will
          choose the specific form; b) the arbitration shall not imply any
          personal appearance of the parties or witnesses unless the parties
          agree otherwise;
        </p>
        <p className="bleeding">
          <li>12.3 Law and forum for disputes</li>
        </p>
        <p className="legal-content">
          Unless the parties agree otherwise or as described in section 12.2
          above, you agree that any claim or dispute you may have against
          Diginet.llc must be resolved by a court located in Atlanta, Georgia.
          You agree to submit to the personal jurisdiction of the courts located
          in Duluth County, Georgia, in order to litigate all these claims or
          disputes. This Agreement shall be governed in all respects by the laws
          of the State of Georgia, without regard to the provisions on conflicts
          of laws.
        </p>
        <p className="bleeding">
          <li>or 12.4 Litigation filed incorrectly</li>
        </p>
        <p className="legal-content">
          All claims you submit against Diginet.llc must be resolved in
          accordance with section 13 of this Agreement. All claims filed or
          filed against section 13 shall be deemed inappropriately filed as a
          breach of this Agreement. If you file a claim contrary to section 12,
          Diginet.llc may recover attorneys' fees and costs (including internal
          and paralegal lawyers) up to $ 10,000.00 USD, provided that
          Diginet.llc has notified you in writing about the claim filed
          incorrectly , and you have not been able to withdraw the claim without
          delay.
        </p>
        <p className="bleeding">
          <li>12.5 Insolvency proceedings</li>
        </p>
        <p className="legal-content">
          If a process is initiated by you or against you under any provision of
          the United States Bankruptcy Code, as amended, or under any other
          bankruptcy or insolvency law, Diginet.llc will be entitled to recover
          all reasonable costs or expenses (including reasonable attorneys' fees
          and expenses) incurred in connection with the application of this
          Agreement.
        </p>
        <p className="bleeding">
          <li>or 12.6 No waiver</li>
        </p>
        <p className="legal-content">
          The fact that we do not act with respect to an infraction of yours or
          third parties does not waive our right to act with respect to
          subsequent or similar infractions.
        </p>
        <p className="bleeding">
          <li>12.7 Compensation</li>
        </p>
        <p className="legal-content">
          You agree to defend, indemnify and disclaim Diginet.llc, its parents,
          officers, directors and employees from any claim or claim (including
          attorney fees) made or incurred by a third party due to your breach of
          this Agreement and / or your use of Diginet.llc services. Unless
          expressly stated otherwise, Diginet.llc shall not be liable for any
          loss or damage, whether direct or indirect, resulting from the
          transactions contemplated in these Terms and Conditions. Diginet.llc
          will not be liable under any circumstances for special, incidental,
          consequential, indirect or punitive damages or losses (including lost
          profits or lost savings), whether or not caused by the fault or
          negligence of Diginet.llc and whether Diginet.llc was aware or not
          that such losses or damages may be incurred.
        </p>
        <p className="bleeding">
          <li>12.8 Assumption of rights</li>
        </p>
        <p className="legal-content">
          If Diginet.llc pays a Claim, Reversion or Return of charge that you
          file against a recipient of your payment, you agree that Diginet.llc
          assumes your rights against the recipient and third parties related to
          the payment, and you may exercise those rights directly or in your
          name, in the discretion of Diginet.llc
        </p>
        <p className="bleeding">
          <li>12.9 Launch of Diginet.llc</li>
        </p>
        <p className="legal-content">
          If you have a dispute with one or more Users, release Diginet.llc (and
          our officers, directors, agents, joint ventures and employees) of each
          and every one of the Claims, claims and damages (real and
          consequential) of all types and nature arising from or in any way
          related to such disputes.
        </p>
      </div>
    );
    const item13 = (
      <div>
        {/* <h5 className="legal-content">13. General provisions</h5> */}
        <p className="bleeding">
          <li>13.1 Limitations of liability</li>
        </p>
        <p className="legal-content2">
          IN NO EVENT WILL WE, OUR EMPLOYEES OR OUR SUPPLIERS BE LIABLE FOR
          PROFIT LOSSES OR ANY SPECIAL, INCIDENTAL OR CONSEQUENTIAL DAMAGES THAT
          COME UP OR IN CONNECTION WITH OUR WEBSITE, THE Diginet.llc SERVICES,
          OR THIS AGREEMENT ). Some states do not allow the exclusion or
          limitation of incidental or consequential damages, so the above
          limitation or exclusion may not apply to you. OUR RESPONSIBILITY AND
          RESPONSIBILITY OF OUR PARENTS, EMPLOYEES AND SUPPLIERS, FOR YOU OR ANY
          THIRD PARTY IN ANY CIRCUMSTANCE, ARE LIMITED TO THE REAL AMOUNT OF
          DIRECT DAMAGES.
        </p>
        <p className="bleeding2">
          <li type="circle">13.1.1 Capital gains / income taxes</li>
          Diginet.llc does not report any transactions from the Client to the
          Internal Revenue Service; However, the purchase or sale of digital
          currency can be considered as taxable income. It is the client's
          responsibility to contact a financial advisor for more information.
          Diginet.llc will not be responsible for any capital gain or tax
          implication due to the purchase or sale of digital currency by the
          Client.
        </p>
        <p className="bleeding2">
          <li type="circle">13.1.2 Technical problems</li>
        </p>
        <p className="bleeding2">
          <li type="circle">
            13.1.2.1 Disclosure and disclaimer of the entry of electronic orders
          </li>
          Diginet.llc specifically disclaims any responsibility for orders
          placed through the online order entry system of Diginet.llc, for
          direct, indirect, consequential or incidental losses or damages, which
          the Client may recognize or incur as a result of the use of the Order
          online from Diginet.llc input system. In addition, Diginet.llc
          specifically disclaims any responsibility for the interruption,
          cancellation or other termination of the online order entry system of
          Diginet.llc or any other Diginet.llc service
        </p>
        <p className="bleeding2">
          <li type="circle">13.1.2.2 Negligence</li>
          All orders placed through the order entry system are taken based on
          the best efforts. Diginet.llc will not be responsible for errors,
          negligence or inability to execute orders. Diginet.llc will not be
          responsible for delays in the transmission, delivery or execution of
          the Customer's order due to failures or failures in the transmission
          or communication facilities, or for any other cause or causes beyond
          the control or reasonable anticipation of Diginet.llc
        </p>
        <p className="bleeding2">
          <li type="circle">13.1.2.3 Possible system failure</li>
          Order entry systems have been designed to provide an efficient and
          reliable method to enter orders. Commercial Internet service providers
          are not 100% reliable and a failure of one or more of these providers
          may affect Internet-based order entry. The Customer acknowledges that
          the order entry system is a mechanical system and, as such, may be
          subject to failures beyond the control of Diginet.llc
        </p>
        <p className="bleeding2">
          <li type="circle">13.1.3 Internet Security</li>
          Diginet.llc adheres to the highest security measures to ensure that
          Customer data is protected against theft, loss and corruption, and
          against misuse and alteration of Customer data stored on our servers.
          However, when a Client accesses his account through a public or
          unsecured computer terminal or if a Client chooses to share the
          username and password of his account ("Electronic Identification
          Information"), Diginet.llc does not You can guarantee the security of
          the account data. Sensitive communication between the Client and the
          Diginet.llc website is always protected by encryption while in
          transit, using the SSL encryption standard. However, the Client must
          be aware that Diginet.llc has no control over the privacy of the
          Client's email communications with us. We strongly recommend that
          Customers do not include private and confidential information in
          emails to Diginet.llc, including, but not limited to, account numbers,
          balances, passwords, electronic identification information, etc.
          Diginet.llc will not be responsible for the damages suffered by the
          Clients if they send us confidential or confidential information by
          email.
        </p>
        <p className="bleeding2">
          <li type="circle">13.1.4 Force majeure</li>
          Diginet.llc will not be liable for breach of its obligations under
          this document due to fire, computer viruses, network failures,
          computer hardware failures, explosion, flood, lightning, acts of
          terrorism, war, rebellion , riots, sabotage, orders or requests from
          any government or any other authority, legislative changes, strikes,
          lockouts or other labor disputes, or events or circumstances beyond
          its reasonable control, but Diginet.llc will make all commercially
          reasonable efforts to minimize the dangers or losses for the Client as
          a result of such events.
        </p>
        <p className="bleeding2">
          <li type="circle">
            13.1.5 It is not legal, accounting, or tax advice
          </li>
          The information provided on the Diginet.llc website is not intended to
          provide legal, accounting or tax advice, and should not be relied on
          in that regard. Diginet.llc is not liable in any way for direct,
          indirect, special or consequential damages that occur, arising from
          the use of its website.
        </p>
        <p className="bleeding">
          {" "}
          <li>or 13.2 No guarantee</li>
        </p>
        <p className="legal-content">
          Diginet.llc, OUR EMPLOYEES AND OUR SUPPLIERS OFFER THE Diginet.llc
          SERVICES AS IS AND WITHOUT ANY WARRANTY OR CONDITION, EXPRESS, IMPLIED
          OR STATUTORY. Diginet.llc, EMPLOYEES AND OUR SUPPLIERS SPECIFICALLY
          REJECT ANY IMPLIED WARRANTIES OF TITLE, MARKETING, FITNESS FOR A
          PARTICULAR PURPOSE AND NON-INFRINGEMENT. Diginet.llc has little
          control over the products or services that are paid for with the
          Services of Diginet.llc and Diginet.llc cannot guarantee that a buyer
          or Seller with whom you are dealing with actually completes the
          transaction or is authorized to do so. Diginet.llc does not guarantee
          continuous, uninterrupted or secure access to any part of the
          Diginet.llc Services, and the operation of our site may be interfered
          with by numerous factors beyond our control. Diginet.llc will make
          every reasonable effort to ensure that electronic debit and credit
          requests related to bank accounts, credit cards, check issuance and
          Diginet.llc are processed in a timely manner, but Diginet.llc does not
          represent or guarantee time necessary to complete the processing
          because Bitcoin services depend on many factors beyond our control,
          such as delays in the banking system or in the international or US
          mail service. UU. Some states do not allow disclaimer of implied
          warranties, so the above disclaimers may not apply to you. This
          paragraph gives you specific legal rights and you may also have other
          legal rights that vary from state to state. and Diginet.llc are
          processed in a timely manner, but Diginet.llc does not represent or
          guarantee the time needed to complete the processing because Bitcoin
          Services depend on many factors beyond our control, such as delays in
          the banking system or in the US. UU. or international mail service.
          Some states do not allow disclaimer of implied warranties, so the
          above disclaimers may not apply to you. This paragraph gives you
          specific legal rights and you may also have other legal rights that
          vary from state to state. and Diginet.llc are processed in a timely
          manner, but Diginet.llc does not represent or guarantee the time
          needed to complete the processing because the Diginet.llc Services
          depend on many factors beyond our control, such as delays in the
          banking system or USA UU. or international mail service. Some states
          do not allow disclaimer of implied warranties, so the above
          disclaimers may not apply to you. This paragraph gives you specific
          legal rights and you may also have other legal rights that vary from
          state to state. therefore, the above waivers may not apply to you.
          This paragraph gives you specific legal rights and you may also have
          other legal rights that vary from state to state. therefore, the above
          waivers may not apply to you. This paragraph gives you specific legal
          rights and you may also have other legal rights that vary from state
          to state.
        </p>
        <p className="bleeding">
          <li>or 13.3 Licensing</li>
        </p>
        <p className="legal-content">
          If you are using the Diginet.llc software, such as an API, a developer
          toolkit or other software application that you have downloaded or
          subscribed to your computer, device or other platform, then
          Diginet.llc grants you a non-exclusive, revocable license and
          non-transferable to use Diginet.llc software according to the
          documentation. This licensing includes the software and all updates,
          upgrades, new versions and replacement software, as described here for
          your personal use only. You may not rent, lease or transfer your
          rights to the software to a third party. You must comply with the
          implementation and use requirements contained in all Diginet.llc
          documentation that accompanies the Diginet.llc Services. If you do not
          meet the requirements for implementation and use of Diginet.llc, you
          will be responsible for all damages resulting to you, Diginet.llc and
          third parties. You agree not to alter, reproduce, adapt, distribute,
          display, publish, reverse engineer, translate, disassemble, decompile
          or attempt to create any source code derived from the software. You
          acknowledge that all rights, titles and interests in the Diginet.llc
          software are the property of Diginet.llc Any third-party software
          application that you use on the Diginet.llc website is subject to the
          license agreed with the third party that provides you with this
          software Diginet.llc does not own, control or have any responsibility
          for any third-party software application that you choose to use on the
          Diginet.llc website and / or in connection with the Services of
          Diginet.llc. If you are using the Diginet.llc Services on the
          Diginet.llc website, or another website or platform hosted by
          Diginet.llc or a third party,
        </p>
        <p className="bleeding">
          <li>or 13.4 Entire Agreement</li>
        </p>
        <p className="legal-content">
          This Agreement, together with the applicable policies and agreements
          on the Legal Agreements page on the Diginet.llc website establishes
          the entire agreement between you and Diginet.llc with respect to the
          Services of Diginet.llc. The terms, which by their nature should
          survive, will survive the termination of this Agreement. If any
          provision of this Agreement is deemed invalid or unenforceable, that
          provision will be deleted and the remaining provisions will apply.
        </p>
        <p className="bleeding">
          <li>13.5 Agreement translated</li>
        </p>
        <p className="legal-content">
          Diginet.llc can provide you with the ability to translate this
          Agreement into a language other than English. Any translation of this
          Agreement is provided solely for your convenience and is not intended
          to modify the terms of this Agreement. In the event of a conflict
          between the English version of this Agreement and a version in a
          language other than English, the English version will apply.
        </p>
      </div>
    );
    const item14 = (
      <div>
        {/* <h5 className="legal-content">14. Definitions</h5> */}
        <p className="legal-content">
          "Account" means a personal or commercial Diginet.llc account.
          <br />
          <br />
          "ACH" means the network of the Automated Clearing House.
          <br />
          <br />
          "Add funds" means your ability to add money to your account balance
          through an acceptable means of payment.
          <br />
          <br />
          Agreement" or "Terms and conditions" shall refer to these terms and
          conditions that will govern the relationship between Diginet.llc and
          the Client with respect to the Website, unless specifically provided
          otherwise and that may be modified from time to time. , without
          warning;
          <br />
          <br />
          "Balance" means any money you have in your Diginet.llc account. The
          terms "money" and "funds" are used interchangeably in this Agreement.
          <br />
          <br />
          "Commercial account" means an account used primarily for commercial
          purposes and not for personal, family or household purposes.
          <br />
          <br />
          "Business Day" shall refer to the operating hours of Diginet.llc
          between 8:00 a.m. and 5:00 p.m., Monday through Friday, except
          Saturdays, Sundays and any legal and holiday holidays;
          <br />
          <br />
          "Business days" means Monday through Friday, excluding holidays.
          <br />
          <br />
          "Chargeback" means a request that a buyer submits directly to their
          credit card company or the credit card issuing bank to invalidate a
          payment.
          <br />
          <br />
          "Claim" means a challenge to a payment that a User presents directly
          with Diginet.llc
          <br />
          <br />
          "Confirmed address" means an address that has been reviewed by
          Diginet.llc and is likely to be that of the User to which it is
          associated.
          <br />
          <br />
          "Customer purchase transaction" shall mean any sale transaction
          through which Diginet.llc sells Bitcoin to its Client;
          <br />
          <br />
          "Customer sale transaction" shall mean any sale transaction through
          which Diginet.llc purchases Bitcoin from its Client;
          <br />
          <br />
          The "Customer Service" is the Diginet.llc customer service that can be
          accessed online through the Diginet.llc customer portal at any time,
          or by sending an email to info@dollarbtc.com or calling +1 (305)
          -794.61.51.
          <br />
          <br />
          "Client" refers to a customer who makes a transaction with Diginet.llc
          for the purchase or sale of Bitcoin and complies with these Terms and
          Conditions between the Client and Diginet.llc
          <br />
          <br />
          "Days" means calendar days.
          <br />
          <br />
          "Default payment methods" refers to the order in which Diginet.llc
          uses its Payment Methods to finance a transaction if you do not select
          a Preferred Payment Method.
          <br />
          <br />
          "Digital goods" means goods that are delivered and used in electronic
          format.
          <br />
          <br />
          "Dispute" means a dispute filed by a User directly with Diginet.llc in
          the online customer portal in accordance with this Agreement.
          <br />
          <br />
          "eCheck" refers to a payment financed by the payment method of the
          sender's bank account that is pending and that the recipient does not
          receive until it is deleted. When you send money using eCheck, it will
          generally remain outstanding for 3-4 business days. The amount of time
          that remains pending will increase if the payment is sent from a bank
          account outside the United States.
          <br />
          <br />
          "Rates" means the amounts indicated in this Agreement.
          <br />
          <br />
          "Holidays" means New Year's Day (January 1), Martin Luther King, Jr.'s
          birthday (the third Monday in January), Washington's birthday (the
          third Monday in February), Memorial Day ( the last Monday in May),
          Independence Day (July 4), Labor Day (the first Monday in September),
          Columbus Day (the second Monday in October), Veterans Day (November
          11), Thanksgiving Day (the fourth Thursday of November) and Christmas
          (December 25). If a holiday falls on a Saturday, Diginet.llc must
          observe the holiday the previous Friday. If the holiday falls on a
          Sunday, Diginet.llc will observe the holiday the following Monday.
          <br />
          <br />
          "Information" refers to any confidential and / or personally
          identifiable information or other information related to an Account or
          User, which includes but is not limited to the following: name, email
          address, billing / shipping address, number of Telephone and financial
          information.
          <br />
          <br />
          "Instant transfer" refers to a payment financed using the payment
          method of the sender's bank account in which Diginet.llc credits the
          recipient instantly.
          <br />
          <br />
          "POS or Web Service" means a Diginet.llc ATM or a machine that hosts
          Diginet.llc software and allows you to buy or sell bitcoins.
          <br />
          <br />
          "Payment method" means the payment method used to finance a
          transaction.
          <br />
          <br />
          "Personal account" means an account used for non-commercial purposes
          and used primarily for personal, family or household purposes.
          <br />
          <br />
          "Policy" or "Policies" means any Policy or other agreement between you
          and Diginet.llc that you have subscribed on the Diginet.llc website,
          or in connection with your use of the Services of Diginet.llc
          <br />
          <br />
          "Grouped accounts" means Accounts in one or more banks insured by the
          FDIC in which Diginet.llc will place User Balances.
          <br />
          <br />
          "Preferred payment method" means a Payment Method that you select to
          finance a payment instead of using the Default Payment Methods.
          <br />
          <br />
          "Redemption code" refers to the sequence of letters, numbers and / or
          symbols placed on gift certificates, promotional coupons or other
          promotional offers and used to make a profit.
          <br />
          <br />
          "Reserve" means a percentage of the funds received in your Account
          that we maintain to protect against the risk of Reversals,
          Chargebacks, Claims or any other liability related to your Account and
          / or the use of the Services of Diginet.llc.
          <br />
          <br />
          "Restricted activities" means those activities described in section 10
          of this Agreement.
          <br />
          <br />
          "Substantial change" means a change in the terms of this Agreement
          that reduces your rights or increases your responsibilities.
          <br />
          <br />
          "Debit card Diginet.llc" means a debit card of the brand Diginet.llc
          that is accepted in any place that accepts MasterCard.
          <br />
          <br />
          "Diginet.llc Services" refers to all our products and services and any
          other feature, technology and / or functionality that we offer on our
          website or by any other means.
          <br />
          <br />
          "Diginet.llc website" shall mean and refer to the Diginet.llc website,
          available at https://dollarbtc.com
          <br />
          <br />
          "Diginet.llc", "we", "us" or "our" means ATM or POS d / b / a
          Diginet.llc and its subsidiaries and affiliates.
          <br />
          <br />
          "User" means any person or entity that uses the Services of
          Diginet.llc including you.
          <br />
          <br />
          "Verified account" refers to the status of an account that reflects
          that Diginet.llc is reasonably certain that the owner of a Diginet.llc
          account has legal control of one or more of its payment methods. The
          status of a verified account does not constitute an approval of a user
          or a guarantee of a user's business practices.
          <br />
          <br />
          "Proof of visible online delivery" refers to the documentation that
          can be viewed online on the approved sender's website and includes the
          address to which the package was delivered.
          <br />
          <br />
          "Confirmation of visible online signature" refers to the documentation
          that can be viewed online on the approved sender's website and
          includes the signature of the person who received the package.
        </p>
      </div>
    );
    const panelsTerms = [
      {
        key: "item1",
        title: t("legal.relationship"),
        content: { content: item1 }
      },
      { key: "item2", title: t("legal.accounts"), content: { content: item2 } },
      { key: "item3", title: t("legal.minutes"), content: { content: item3 } },
      { key: "item4", title: t("legal.payment"), content: { content: item4 } },
      {
        key: "item5",
        title: t("legal.cancellations"),
        content: { content: item5 }
      },
      {
        key: "item6",
        title: t("legal.accountBalances"),
        content: { content: item6 }
      },
      {
        key: "item7",
        title: t("legal.closeAccount"),
        content: { content: item7 }
      },
      { key: "item8", title: t("legal.rate"), content: { content: item8 } },
      { key: "item9", title: t("legal.risk"), content: { content: item9 } },
      {
        key: "item10",
        title: t("legal.rules"),
        content: { content: item10 }
      },
      {
        key: "item11",
        title: t("legal.responsibility"),
        content: { content: item11 }
      },
      {
        key: "item12",
        title: t("legal.disputes"),
        content: { content: item12 }
      },
      {
        key: "item13",
        title: t("legal.generalProvisions"),
        content: { content: item13 }
      },
      {
        key: "item14",
        title: t("legal.definitions"),
        content: { content: item14 }
      }
    ];
    const contentTermsAndConditions = (
      <div>
        <p className="legal-content">
          PLEASE READ THESE TERMS OF SALE CAREFULLY. BY CREATING AN ACCOUNT WITH
          US, OR PURCHASING OR SELLING ANY VIRTUAL CURRENCY THROUGH ANY OF OUR
          AUTOMATED VIRTUAL CURRENCY, YOU LEGALLY ACCEPT THESE TERMS OF SALE AND
          ALL PERFORMANCE. IF YOU DO NOT AGREE TO ALL OF THESE TERMS, DO NOT
          CREATE AN ACCOUNT Diginet.llc, OR BUY OR SELL ANY VIRTUAL CURRENCY
          THROUGH ANY POS Diginet.llc. ATM. d / b / a Diginet.llc ("Diginet.llc
          ", "we" or "we" or "our") sells and purchases virtual currency through
          our web service or POS. Your purchase or sale of virtual currency
          through a POS, and your use of our website Diginet.llc (the "Site")
          and our mobile application (collectively, the "Services"), are
          governed by these Terms of Sale. By using our Services, you
          acknowledge that any transaction is made solely between you and
          Diginet.llc and not on behalf of third parties or for their benefit
          Diginet.llc reserves the right to change or modify these Terms of Sale
          at any time and at our sole discretion. The amended Terms of Sale will
          become effective immediately after your use of any POS or Web Service
          in which the amended Terms of Sale are published, and will apply to
          all subsequent purchase and sale transactions. This User Agreement
          ("Agreement") is a contract between you and Diginet.llc and applies to
          your use of the Diginet.llc website and all related sites,
          applications, services and tools, regardless of how you access or use
          them. You must read, accept and accept all the terms and conditions
          contained in this Agreement. In addition, you must read, accept the
          following agreements:
        </p>
        <p className="bleeding">
          <li>Terms of Service</li>
          <br />
          <li>Privacy Policy</li>
          <br />
          <li>Delivery Policy</li>
          <br />
          <li>Refund Policy</li>
          <br />
          <li>Disclaimer</li>
          <br />
          <li>License</li>
          <br />
        </p>
        <p className="legal-content">
          We may modify this Agreement at any time by posting a revised version
          on our website. The revised version will be effective at the time we
          publish it. This is an important document, which you should carefully
          consider when choosing whether to use the Services of Diginet.llc.
          This Agreement also highlights certain risks of using the Diginet.llc
          Services.
        </p>

        <Accordion
          style={{
            backgroundColor: isMobile ? "#F0F0F0" : "",
            boxShadow: "none"
          }}
          panels={panelsTerms}
        />
      </div>
    );
    const panels = [
      {
        key: "terms",
        title: t("legal.term"),
        content: { content: contentTermsAndConditions }
      },
      { key: "aml", title: "AML", content: { content: aml } },
      {
        key: "cookies",
        title: t("legal.cookies"),
        content: { content: cookiesPolices }
      },
      {
        key: "documents",
        title: t("legal.documents"),
        content: { content: documents }
      }
    ];
    return (
      <div>
        <Responsive minWidth={992}>
          <Container>
            <Grid columns={1}>
              <Grid.Column
                largeScreen={16}
                mobile={16}
                tablet={16}
                computer={16}
              >
                <Container>
                  <Segment color="orange">
                    <Header
                      as="h4"
                      style={{
                        color: "#207ef2",
                        fontWeight: "bold",
                        textAlign: "center",
                        paddingTop: 20
                      }}
                      size="medium"
                    >
                      {t("legal.title")}
                    </Header>
                    <Container>
                      <Accordion
                        defaultActiveIndex={0}
                        panels={panels}
                        fluid
                        styled
                      />
                    </Container>
                  </Segment>
                </Container>
              </Grid.Column>
            </Grid>
          </Container>
        </Responsive>
        <Responsive minWidth={0} maxWidth={991}>
          <Container>
            <Grid columns={1}>
              <Grid.Column
                largeScreen={16}
                mobile={16}
                tablet={16}
                computer={16}
              >
                <Divider hidden></Divider>
                <Container>
                  <Header
                    as="h4"
                    style={{
                      color: "#207ef2",
                      fontWeight: "bold",
                      textAlign: "center",
                      paddingTop: 20
                    }}
                    className="titleComponent"
                    size="medium"
                  >
                    {t("legal.title")}
                  </Header>
                  <Container>
                    <hr style={{ borderColor: "#207ef2" }}></hr>
                    <Divider hidden></Divider>
                    <Accordion
                      fluid
                      styled
                      style={{ backgroundColor: "#F0F0F0" }}
                    >
                      <Accordion.Title
                        active={activeIndex === 0}
                        index={0}
                        onClick={this.handleClick.bind(this)}
                      >
                        <Grid columns={3}>
                          <Grid.Column
                            largeScreen={13}
                            mobile={13}
                            tablet={13}
                            computer={13}
                          >
                            <p className="legal-title">{t("legal.term")}</p>
                          </Grid.Column>
                          <Grid.Column
                            largeScreen={2}
                            mobile={2}
                            tablet={2}
                            computer={2}
                          >
                            <Icon name="chevron down" size="large" />
                          </Grid.Column>
                        </Grid>
                      </Accordion.Title>
                      <Accordion.Content
                        style={{
                          width: window.innerWidth <= 384 ? 220 : "",
                          textAlign: window.innerWidth <= 384 ? "left" : "left",
                          padding: window.innerWidth <= 384 ? 1 : "",
                          marginLeft: window.innerWidth <= 384 ? -30 : ""
                        }}
                        active={activeIndex === 0}
                      >
                        <hr
                          style={{ borderColor: "#A5A5A5", marginLeft: 40 }}
                        ></hr>
                        {contentTermsAndConditions}
                      </Accordion.Content>
                    </Accordion>
                    <Divider hidden></Divider>
                    <Accordion
                      fluid
                      styled
                      style={{
                        backgroundColor: "#F0F0F0",
                        width: window.innerWidth <= 384 ? 220 : "",
                        textAlign: window.innerWidth <= 384 ? "left" : "left",
                        padding: window.innerWidth <= 384 ? 1 : "",
                        marginLeft: window.innerWidth <= 384 ? -30 : ""
                      }}
                    >
                      <Accordion.Title
                        active={activeIndex === 1}
                        index={1}
                        onClick={this.handleClick.bind(this)}
                      >
                        <Grid columns={3}>
                          <Grid.Column
                            largeScreen={13}
                            mobile={13}
                            tablet={13}
                            computer={13}
                          >
                            <p className="legal-title">AML</p>
                          </Grid.Column>
                          <Grid.Column
                            largeScreen={2}
                            mobile={2}
                            tablet={2}
                            computer={2}
                          >
                            <Icon name="chevron down" size="large" />
                          </Grid.Column>
                        </Grid>
                      </Accordion.Title>
                      <Accordion.Content
                        active={activeIndex === 1}
                        style={{
                          width: window.innerWidth <= 384 ? 220 : "",
                          textAlign: window.innerWidth <= 384 ? "left" : "left",
                          padding: window.innerWidth <= 384 ? 1 : "",
                          marginLeft: window.innerWidth <= 384 ? -30 : ""
                        }}
                      >
                        <hr
                          style={{ borderColor: "#A5A5A5", marginLeft: 40 }}
                        ></hr>
                        <p className="legal-content">
                          <a
                            href={DiginetAML}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            Diginet WORD AML.pdf
                          </a>
                        </p>
                      </Accordion.Content>
                    </Accordion>
                    <Divider hidden></Divider>
                    <Accordion
                      fluid
                      styled
                      style={{ backgroundColor: "#F0F0F0" }}
                    >
                      <Accordion.Title
                        active={activeIndex === 2}
                        index={2}
                        onClick={this.handleClick.bind(this)}
                      >
                        <Grid columns={3}>
                          <Grid.Column
                            largeScreen={13}
                            mobile={13}
                            tablet={13}
                            computer={13}
                          >
                            <p
                              className="legal-title"
                              style={
                                activeIndex === 2 ? { color: "#207ef2" } : {}
                              }
                            >
                              {t("legal.cookies")}
                            </p>
                          </Grid.Column>
                          <Grid.Column
                            largeScreen={2}
                            mobile={2}
                            tablet={2}
                            computer={2}
                          >
                            <Icon name="chevron down" size="large" />
                          </Grid.Column>
                        </Grid>
                      </Accordion.Title>
                      <Accordion.Content
                        active={activeIndex === 2}
                        style={{
                          width: window.innerWidth <= 384 ? 220 : "",
                          textAlign: window.innerWidth <= 384 ? "left" : "left",
                          padding: window.innerWidth <= 384 ? 1 : "",
                          marginLeft: window.innerWidth <= 384 ? -30 : ""
                        }}
                      >
                        <hr
                          style={{ borderColor: "#A5A5A5", marginLeft: 40 }}
                        ></hr>
                        {cookiesPolices}
                      </Accordion.Content>
                    </Accordion>
                    <Divider hidden></Divider>
                    <Accordion
                      fluid
                      styled
                      style={{ backgroundColor: "#F0F0F0" }}
                    >
                      <Accordion.Title
                        active={activeIndex === 3}
                        index={3}
                        onClick={this.handleClick.bind(this)}
                      >
                        <Grid columns={3}>
                          <Grid.Column
                            largeScreen={13}
                            mobile={13}
                            tablet={13}
                            computer={13}
                          >
                            <p
                              className="legal-title"
                              style={
                                activeIndex === 3 ? { color: "#207ef2" } : {}
                              }
                            >
                              {t("legal.documents")}
                            </p>
                          </Grid.Column>
                          <Grid.Column
                            largeScreen={2}
                            mobile={2}
                            tablet={2}
                            computer={2}
                          >
                            <Icon name="chevron down" size="large" />
                          </Grid.Column>
                        </Grid>
                      </Accordion.Title>
                      <Accordion.Content
                        active={activeIndex === 3}
                        style={{
                          width: window.innerWidth <= 384 ? 220 : "",
                          textAlign: window.innerWidth <= 384 ? "left" : "left",
                          padding: window.innerWidth <= 384 ? 1 : "",
                          marginLeft: window.innerWidth <= 384 ? -30 : ""
                        }}
                      >
                        <hr
                          style={{ borderColor: "#A5A5A5", marginLeft: 40 }}
                        ></hr>
                        <p className="legal-content">
                          <a
                            href={certificate}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            Certificate of Organization Diginet Llc.pdf
                          </a>
                        </p>
                        <p className="legal-content">
                          <a
                            href={curriculum}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            Diginet LLC Curriculum.pdf
                          </a>
                        </p>
                      </Accordion.Content>
                    </Accordion>
                    <Divider hidden></Divider>
                  </Container>
                </Container>
              </Grid.Column>
            </Grid>
          </Container>
        </Responsive>
      </div>
    );
  }
}
export default translate(Legal);
