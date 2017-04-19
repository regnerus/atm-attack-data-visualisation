import csv

import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.metrics import confusion_matrix, accuracy_score
from sklearn.naive_bayes import MultinomialNB

datafile = open("data.csv")
datareader = csv.DictReader(datafile)

banks = {}
bankpropertykeys = ["MWay_Dist", "NUMBER", "N_INCOME", "N_DENSITY", "N_AGE",
                    "N_UNP_RATE", "N_COM_DENS","Police_Dis"]
itt = 0
for row in datareader:
    #itt = itt+1
    id = row['ATM_ID']
    #id = itt

    banks[id] = row

print(banks.keys())
print(len(banks))

Y = []
X = []
for key, value in banks.items():
    Y.append(str(value['N_FREQ_ATTACK']))
    features = [value[x] for x in bankpropertykeys]
    X.append(features)

X = np.matrix(X).astype(np.float)

Y = np.array(Y)
X_train, X_test, y_train, y_test = train_test_split(X, Y, test_size=0.25, random_state=42)


clf = MultinomialNB()
clf.fit(X_train, y_train)

y_predict=[]
for x in X_test:
    y_predict.append(clf.predict(x)[0])
print(y_predict)

print(confusion_matrix(y_test, y_predict))
print(accuracy_score(y_test,y_predict))

def dataPointClassify(id,model):
    f = np.array([banks.get(id)[x] for x in bankpropertykeys]).astype(np.float)
    f = f.reshape([1, f.size])
    return model.predict(f)

def getProb(id, model):
    f = np.array([banks.get(id)[x] for x in bankpropertykeys]).astype(np.float)
    f = f.reshape([1, f.size])
    #print(f.shape)
    return model.predict_proba(f)



def show_most_informative_features(feature_names, clf, n=20):
    coefs_with_fns = sorted(zip(clf.coef_[0], feature_names))
    top = zip(coefs_with_fns[:n], coefs_with_fns[:-(n + 1):-1])
    for (coef_1, fn_1), (coef_2, fn_2) in top:
        print("\t%.4f\t%-15s\t\t%.4f\t%-15s" % (coef_1, fn_1, coef_2, fn_2))


output = []
for key, value in banks.items():
    value['PROB_ATTACKED'] = getProb(key,clf)[0,1]
    output.append(value)

with open('results.csv', 'w') as csvfile:
    fieldnames = list(output[0].keys())
    writer = csv.DictWriter(csvfile, fieldnames=fieldnames)

    writer.writeheader()
    for row in output:
        writer.writerow(row)

print(show_most_informative_features(bankpropertykeys,clf))