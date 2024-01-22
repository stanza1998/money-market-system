import axios from "axios";
import { db } from "../../../config/firebase-config";

import AppStore from "../../../stores/AppStore";
import AppApi from "../../AppApi";
import { Unsubscribe, collection, doc, onSnapshot, query, setDoc } from "firebase/firestore";
import DocFoxApplicationsModel, { IDocFoxApplications } from "../../../models/clients/DocFoxApplicationsModel";

export default class KYCApplicationApi {
    constructor(private api: AppApi, private store: AppStore) {
    }

    private kycApplicationsPath = () => {
        return "kycApplications";
    }

    private findMissingApplicationsFromDatabase(docFoxApplications: IDocFoxApplications[], databaseApplications: DocFoxApplicationsModel[]): IDocFoxApplications[] {

        const employeeCodesSet = new Set(databaseApplications.map(item => `${item.asJson.id}`));
        const missingApplications= docFoxApplications.filter(docFoxApplication => employeeCodesSet.has(`${docFoxApplication.id}`));
    
        return missingApplications;
    }

    // async getKYCApplicationsFromDocFox() {

    //     this.getKYCApplicationsFromDatabase();

    //     const databaseApplications = this.store.docFoxApplication.all;
    //     console.log("DB Applications", databaseApplications);
        
    //     if (databaseApplications.length !== 0) {

    //         const kycApplicationsUrl = 'https://us-central1-ijgmms.cloudfunctions.net/getKYCApplications';
    //         try {
    //             const response = await axios.get(kycApplicationsUrl, {
    //                 headers: {
    //                     'Content-Type': 'application/json',
    //                     'Accept': 'application/json',
    //                     'Cache-Control': 'no-cache',
    //                 },
    //             });

    //             const tokenData = response.data;

    //             const docfoxApplications: IDocFoxApplications[] = tokenData.map((tokenData: any) => ({
    //                 id: tokenData.id,
    //                 kycProfileId: tokenData.relationships.profile.data.id,
    //                 kycEntityType: tokenData.attributes.kyc_entity_type_name,
    //             }));

    //             console.log(docfoxApplications);
                

    //             if (docfoxApplications.length > databaseApplications.length) {
    //                 //compare the missing
    //                 const missingApplications = this.findMissingApplicationsFromDatabase(docfoxApplications,databaseApplications);

    //                 missingApplications.forEach(missingApplication => {
    //                     this.createKYCApplication(missingApplication);
    //                 });
    //             }else{
    //                 return
    //             }

    //         } catch (error) {
    //             console.log(error);
    //         }
    //     }else{
    //         const kycApplicationsUrl = 'https://us-central1-ijgmms.cloudfunctions.net/getKYCApplications';

    //         try {
    //             const response = await axios.get(kycApplicationsUrl, {
    //                 headers: {
    //                     'Content-Type': 'application/json',
    //                     'Accept': 'application/json',
    //                     'Cache-Control': 'no-cache',
    //                 },
    //             });

    //             const tokenData = response.data;

    //             const applications: IDocFoxApplications[] = tokenData.map((tokenData: any) => ({
    //                 id: tokenData.id,
    //                 kycProfileId: tokenData.relationships.profile.data.id,
    //                 kycEntityType: tokenData.attributes.kyc_entity_type_name,
    //             }));

    //             applications.forEach(application => {
    //                 this.createKYCApplication(application);
    //             });

    //         } catch (error) {
    //             console.log(error);
    //         }
    //     }
    // }

    // async getKYCApplicationsFromDatabase() {
    //     this.store.docFoxApplication.removeAll();

    //     const path = this.kycApplicationsPath();
    //     if (!path) return;

    //     const $query = query(collection(db, path));

    //     return await new Promise<Unsubscribe>((resolve, reject) => {
    //         const unsubscribe = onSnapshot($query, (querySnapshot) => {
    //             const kycApplications: IDocFoxApplications[] = [];
    //             querySnapshot.forEach((doc) => {
    //                 kycApplications.push({ id: doc.id, ...doc.data() } as IDocFoxApplications);
    //             });
    //             this.store.docFoxApplication.load(kycApplications);
    //             kycApplications.forEach(kycApplication => {
    //                 this.api.docfox.kycProfiles.getKYCProfilesFromDocFox(kycApplication.kycProfileId, kycApplication.id, kycApplication.kycEntityType);
    //                 this.api.docfox.kycProfiles.getById(kycApplication.kycProfileId);
    //             });
    //             resolve(unsubscribe);
    //         }, (error) => {
    //             reject();
    //         });
    //     });
    // }

    // async getById(id: string) {
    //     const path = this.kycApplicationsPath();
    //     if (!path) return;

    //     const unsubscribe = onSnapshot(doc(db, path, id), (doc) => {
    //         if (!doc.exists) return;
    //         const item = { id: doc.id, ...doc.data() } as IDocFoxApplications;
    //         this.api.docfox.kycProfiles.getKYCProfilesFromDocFox(item.kycProfileId, item.id, item.kycEntityType);
    //         this.api.docfox.kycProfiles.getById(item.kycProfileId);
    //         this.getKYCApplicationRelatedEntities(item.id);
    //         this.getKYCApplicationRelatedEntities(item.id);
    //         this.store.docFoxApplication.load([item]);
    //     });

    //     return unsubscribe;
    // }

    // async createKYCApplication(kycApplication: IDocFoxApplications) {
    //     const path = this.kycApplicationsPath();
    //     if (!path) return;

    //     const itemRef = doc(collection(db, path), kycApplication.id)
    //     // kycApplication.id = itemRef.id;

    //     try {
    //         await setDoc(itemRef, kycApplication, { merge: true, })
    //     } catch (error) {
    //         console.log(error);
    //     }

    // }

    // Links

    // async getKYCApplicationRiskRatings(kycApplicationId: string) {
    //     const kycApplicationsUrl = 'https://us-central1-ijgmms.cloudfunctions.net/getKYCApplicationRiskRatings';
    //     try {
    //         const response = await axios.get(kycApplicationsUrl, {
    //             headers: {
    //                 'Content-Type': 'application/json',
    //                 'Accept': 'application/json',
    //                 'Cache-Control': 'no-cache',
    //                 "X-KYC-Application-Id": kycApplicationId,
    //             },
    //         });

    //         const responseData = response.data.data;

    //         const riskRatings: any = responseData.map((tokenData: any) => ({
    //             profile: tokenData.attributes.rating,
    //         }));

    //         // this.store.docFoxApplication.load(applications);

    //         console.log(responseData);

    //     } catch (error) {
    //         console.log(error);
    //     }
    // }

    // async getKYCApplicationRelatedEntities(kycApplicationId: string) {
    //     const kycApplicationsUrl = 'https://us-central1-ijgmms.cloudfunctions.net/getKYCApplicationRelatedEntities';
    //     try {
    //         const response = await axios.get(kycApplicationsUrl, {
    //             headers: {
    //                 'Content-Type': 'application/json',
    //                 'Accept': 'application/json',
    //                 'Cache-Control': 'no-cache',
    //                 "X-KYC-Application-Id": kycApplicationId,
    //             },
    //         });

    //         const tokenData = response.data;

    //         // const applications: IDocFoxApplications[] = tokenData.map((tokenData: any) => ({
    //         //   profile: tokenData.relationships.profile.data.id,
    //         //   id: tokenData.id,
    //         //   applicationId: tokenData.id,
    //         //   kyc_entity_type: tokenData.attributes.kyc_entity_type_name,
    //         //   status: tokenData.attributes.status.status,
    //         // }));

    //         console.log(tokenData);


    //     } catch (error) {
    //         console.log(error);
    //     }
    // }
}


