mydata = read.csv("~/MSc Geoinformatics 2015/Sem 2/Linked open data and javascript_6ECTS/migrantByYear.csv")
head(mydata)
mydata1 = read.csv("C:/Users/Avipsa/Documents/MSc Geoinformatics 2015/Sem 2/Linked open data and javascript_6ECTS/MigranthouseholdsYearly.csv")
mydata1$Borough <- tolower(gsub("[0-9]+","",mydata1$Borough)) # remove numbers appearing before names in Borough column
  mydata2 = read.csv("C:/Users/Avipsa/Documents/MSc Geoinformatics 2015/Sem 2/Linked open data and javascript_6ECTS/MigrationByAgeGroup.csv")
mydata2$Borough <- tolower(gsub("[0-9]+","",mydata1$Borough)) # remove numbers appearing before names in Borough column


mydata$M2010 <- paste("lodcom:",mydata$Borough," lodcom:MigrationHistory2010 ",mydata$X2010,".",sep="")
mydata$M2011 <- paste("lodcom:",mydata$Borough," lodcom:MigrationHistory2011 ",mydata$X2011,".",sep="")
mydata$M2012 <- paste("lodcom:",mydata$Borough," lodcom:MigrationHistory2012 ",mydata$X2012,".",sep="")
mydata$M2013 <- paste("lodcom:",mydata$Borough," lodcom:MigrationHistory2013 ",mydata$X2013,".",sep="")
mydata$M2014 <- paste("lodcom:",mydata$Borough," lodcom:MigrationHistory2014 ",mydata$X2014,".",sep="")
head(mydata)

mydata1$M2010 <- paste("lodcom:",mydata1$Borough," lodcom:HouseholdwithMajorityPopulationMigrationHistory2010 ",mydata1$X2010,".",sep="")
mydata1$M2011 <- paste("lodcom:",mydata1$Borough," lodcom:HouseholdwithMajorityPopulationMigrationHistory2011 ",mydata1$X2011,".",sep="")
mydata1$M2012 <- paste("lodcom:",mydata1$Borough," lodcom:HouseholdwithMajorityPopulationMigrationHistory2012 ",mydata1$X2012,".",sep="")
mydata1$M2013 <- paste("lodcom:",mydata1$Borough," lodcom:HouseholdwithMajorityPopulationMigrationHistory2013 ",mydata1$X2013,".",sep="")
mydata1$M2014 <- paste("lodcom:",mydata1$Borough," lodcom:HouseholdwithMajorityPopulationMigrationHistory2014 ",mydata1$X2014,".",sep="")
head(mydata1)

mydata2$overall <- paste("lodcom:",mydata2$Borough," lodcom:MigrationAgeGroups2014_overall ",mydata2$overall,".",sep="")
mydata2$`0-9` <- paste("lodcom:",mydata2$Borough," lodcom:MigrationAgeGroups2014_0-9 ",mydata2$`0-9`,".",sep="")
mydata2$`10-19` <- paste("lodcom:",mydata2$Borough," lodcom:MigrationAgeGroups2014_10-19 ",mydata2$`10-19`,".",sep="")
mydata2$`20-29` <- paste("lodcom:",mydata2$Borough," lodcom:MigrationAgeGroups2014_20-29 ",mydata2$`20-29`,".",sep="")
mydata2$`30-39` <- paste("lodcom:",mydata2$Borough," lodcom:MigrationAgeGroups2014_30-39 ",mydata2$`30-39`,".",sep="")
mydata2$`40-49` <- paste("lodcom:",mydata2$Borough," lodcom:MigrationAgeGroups2014_40-49 ",mydata2$`40-49`,".",sep="")
mydata2$`50-59` <- paste("lodcom:",mydata2$Borough," lodcom:MigrationAgeGroups2014_30-39 ",mydata2$`50-59`,".",sep="")
mydata2$`60-69` <- paste("lodcom:",mydata2$Borough," lodcom:MigrationAgeGroups2014_30-39 ",mydata2$`60-69`,".",sep="")
mydata2$`70-79` <- paste("lodcom:",mydata2$Borough," lodcom:MigrationAgeGroups2014_30-39 ",mydata2$`70-79`,".",sep="")
mydata2$`80-89` <- paste("lodcom:",mydata2$Borough," lodcom:MigrationAgeGroups2014_30-39 ",mydata2$`80-89`,".",sep="")
mydata2$`>90` <- paste("lodcom:",mydata2$Borough," lodcom:MigrationAgeGroups2014_30-39 ",mydata2$`>90`,".",sep="")
head(mydata1)

migrantsByYear <- list()
householdsByYear <- list()
migrantsByAge <- list()
for(i in 1:nrow(mydata1))
{
  #migrantsByYear[[i]] <- cbind(mydata$M2010[i],mydata$M2011[i],mydata$M2012[i],mydata$M2013[i],mydata$M2014[i])
  householdsByYear[[i]] <- cbind(mydata1$M2010[i],mydata1$M2011[i],mydata1$M2012[i],mydata1$M2013[i],mydata1$M2014[i])
 # migrantsByAge[[i]] <- cbind(mydata2$overall[i],mydata2$`0-9`[i],mydata2$`10-19`[i],mydata2$`20-29`[i],mydata2$`30-39`[i],mydata2$`40-49`[i],mydata2$`50-59`[i],mydata2$`60-69`[i],mydata2$`70-79`[i],mydata2$`80-89`[i],mydata2$`>90`[i])
}

write.csv(unlist(migrantsByYear),"C:/Users/Avipsa/Desktop/migrantsByYear.csv")
write.csv(unlist(householdsByYear),"C:/Users/Avipsa/Desktop/householdsByYear.csv")
write.csv(unlist(migrantsByAge),"C:/Users/Avipsa/Desktop/migrantsByAge.csv")
