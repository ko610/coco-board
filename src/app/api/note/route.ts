import { db } from '@/app/firebase-admin';
// import { db } from '@/app/firebase';
import { FieldValue } from "firebase/firestore";
import { collection, addDoc } from "firebase/firestore";
import { NextRequest, NextResponse } from 'next/server';
import dayjs from 'dayjs';


// 最新の日付のノートを取得する関数
async function getLatestNotes(uid: string) {
    const docRef = Array();
    
    // 最新の日付を取得するクエリ
    const latestGameDate = await db.collection("game")
        .where("uid", "==", uid)
        .orderBy("date", "desc")
        .limit(1)
        .get();

    const latestPracticeDate = await db.collection("practice")
        .where("uid", "==", uid)
        .orderBy("date", "desc")
        .limit(1)
        .get();

    // 最新の日付を決定
    let latestDate = null;
    if (!latestGameDate.empty && !latestPracticeDate.empty) {
        // 両方のコレクションにデータがある場合、より新しい日付を使用
        const gameDate = latestGameDate.docs[0].data().date;
        const practiceDate = latestPracticeDate.docs[0].data().date;
        latestDate = gameDate >= practiceDate ? gameDate : practiceDate;
    } else if (!latestGameDate.empty) {
        latestDate = latestGameDate.docs[0].data().date;
    } else if (!latestPracticeDate.empty) {
        latestDate = latestPracticeDate.docs[0].data().date;
    }

    if (latestDate) {
        // 最新の日付のデータを取得
        const gameDocRef = await db.collection("game")
            .where("uid", "==", uid)
            .where("date", "==", latestDate)
            .get()
            .then(snapshot => {
                snapshot.forEach((doc) => {
                    const ob = doc.data();
                    ob.contentsId = doc.id;
                    ob.collection = "game";
                    docRef.push([ob]);
                });
            }).catch((error) => {
                console.log("Error getting documents: ", error);
            });

        const practiceDocRef = await db.collection("practice")
            .where("uid", "==", uid)
            .where("date", "==", latestDate)
            .get()
            .then(snapshot => {
                snapshot.forEach((doc) => {
                    const ob = doc.data();
                    ob.contentsId = doc.id;
                    ob.collection = "practice";
                    docRef.push([ob]);
                });
            }).catch((error) => {
                console.log("Error getting documents: ", error);
            });
    }

    return docRef;
}

export async function GET(
    req: NextRequest,
    res: NextResponse
) {
    const uid = req.nextUrl.searchParams.get("uid");
    const date = req.nextUrl.searchParams.get("date");
    const contentsId = req.nextUrl.searchParams.get("contentsId");

    if (uid && !date) {
        const docRef = Array();
        await db.collection('game').where("uid", "==", uid).get()
            .then(snapshot => {
                snapshot.forEach((doc) => {
                    const ob = doc.data();
                    ob.collection = "game";
                    docRef.push(ob);
                });
            })
            .catch((error) => {
                console.log("Error getting game documents: ", error);
            });

        await db.collection('practice').where("uid", "==", uid).get()
            .then(snapshot => {
                snapshot.forEach((doc) => {
                    const ob = doc.data();
                    ob.collection = "practice";
                    docRef.push(ob);
                });
            })
            .catch((error) => {
                console.log("Error getting practice documents: ", error);
            });

        return NextResponse.json(docRef, { status: 200 });

    } else if (uid && date) {
        const docRef = Array();
        const gameDocRef = await db.collection("game").where("uid", "==", uid).where("date", "==", date).get()
            .then(snapshot => {
                snapshot.forEach((doc) => {
                    const ob = doc.data();
                    ob.contentsId = doc.id;
                    ob.collection = "game";
                    docRef.push([ob]);
                });
            }).catch((error) => {
                console.log("Error getting documents: ", error);
            });

        const practiceDocRef = await db.collection("practice").where("uid", "==", uid).where("date", "==", date).get()
            .then(snapshot => {
                snapshot.forEach((doc) => {
                    const ob = doc.data();
                    ob.contentsId = doc.id;
                    ob.collection = "practice";
                    docRef.push([ob]);
                });
            }).catch((error) => {
                console.log("Error getting documents: ", error);
            });

        return NextResponse.json(docRef, { status: 200 });
    } else {
        const docRef = await getLatestNotes(uid);
        return NextResponse.json(docRef, { status: 200 });
    }
}


const sortDateContents = (dateArray, contents, collection) => {

    for (let index = 0; index < contents.length; index++) {
        let flag = false
        contents[index].collection = collection
        for (let index2 = 0; index2 < dateArray.length; index2++) {
            if (dateArray[index2].date === dayjs(String(contents[index].date)).format('YYYY/M/DD')) {
                flag = true
                dateArray[index2].contents.push(contents[index])
                break
            }
        }
        if (!flag) {
            dateArray.push({ date: dayjs(String(contents[index].date)).format('YYYY/M/DD'), contents: [contents[index]] })
        }
    }
    return dateArray
}

const sortContents = (gameContents, practiceContents) => {
    let dateArray = [{ date: null, contents: [] }]
    const contents = []
    if (gameContents[0] != null)
        dateArray = sortDateContents(dateArray, gameContents, "game")
    if (practiceContents[0] != null)
        dateArray = sortDateContents(dateArray, practiceContents, "practice")

    dateArray.splice(0, 1)

    dateArray.sort((a, b) => {
        if (a.date < b.date) return 1;
        else if (a.date > b.date) return -1;
        return 0;
    })

    return dateArray
}