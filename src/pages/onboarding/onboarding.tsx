import Layout from "../../components/layout";
import {useTranslation} from "react-i18next";
import {Box, Button, MobileStepper, Step, StepContent, StepLabel, Stepper} from "@mui/material";
import React, {ReactElement, useContext, useState} from "react";
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import WelcomeStep from "./steps/welcome";
import LicenseStep from "./steps/license";
import PreferencesStep from "./steps/preferences";
import CompletedStep from "./steps/completed";
import LanguageStep from "./steps/language";
import BackupsStep from "./steps/backups";
import defer from "../../utils/defer";
import {SettingsContext} from "../../context/settingsContext";
import {useNavigate} from "react-router-dom";
import ImportStep from "./steps/import";

const Onboarding = () => {
    const {t} = useTranslation();
    const steps = [t("onboarding.language.title"), t("onboarding.welcome.title"), t("onboarding.license.title"),
        t("onboarding.preferences.title"), t("onboarding.importData.title"),
        t("onboarding.backups.title"), t("onboarding.completed.title")];
    const [activeStep, setActiveStep] = useState(0);
    const [completable, setCompletable] = useState(false);
    const [importData, setImportData ] = useState(false);
    const stepContent: ReactElement[] = [<LanguageStep setCompletable={setCompletable} />, <WelcomeStep setCompletable={setCompletable}/>,
        <LicenseStep setCompletable={setCompletable}/>,
        <PreferencesStep setCompletable={setCompletable}/>,
        <ImportStep importData={importData} setImportData={setImportData} setCompletable={setCompletable}/>, <BackupsStep setCompletable={setCompletable}/>, <CompletedStep setCompletable={setCompletable}/>];
    const { saveOnboardingCompleted } = useContext(SettingsContext);
    const navigate = useNavigate();

    const scrollToStep = (stepNumber: number) => {
        const step = document.getElementById(`step-${stepNumber}`);
        const stepper = document.getElementById("stepperBox");
        if (step && stepper) stepper.scroll({top: step.offsetTop - 60, behavior: "smooth"});
    }

    const handleNext = () => {
        if (completable) {
            const nextStep = activeStep + 1;
            if (nextStep === steps.length) {
                if (saveOnboardingCompleted) saveOnboardingCompleted(true);
                navigate(importData ? "/onboarding/backup" : "/");
                return;
            }
            setActiveStep(nextStep);
            setCompletable(false);
            defer(() => {
                scrollToStep(nextStep);
            })
        }
    }

    const handleBack = () => {
        const prevStep = activeStep - 1;
        setActiveStep(prevStep);
        setCompletable(false);
        defer(() => {
            scrollToStep(prevStep);
        })
    }

    return <Layout hideBack hideNav title={t("onboarding.title")} sx={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        width: "calc(100% - 24px)",
        paddingLeft: "12px",
        paddingRight: "12px"
    }}>
        <Box id="stepperBox" sx={{paddingTop: "8px",height: "calc(100% - 80px)", paddingBottom: "20px", overflowY: "auto"}}><Stepper activeStep={activeStep} orientation="vertical">
            {steps.map((label, index) => {
                return (
                    <Step id={`step-${index.toString()}`} key={label}>
                        <StepLabel>{label}</StepLabel>
                        {index === activeStep && <StepContent>{stepContent[index]}</StepContent>}
                    </Step>
                );
            })}
        </Stepper></Box>
        <MobileStepper
            sx={{ boxShadow: 4, backgroundColor: (theme) => theme.palette.background.paper, position: "fixed", width: "100vw", left: 0}}
            variant="dots"
            steps={steps.length}
            position="static"
            activeStep={activeStep}
            nextButton={
                <Button size="small" sx={{marginRight: "12px"}} onClick={handleNext} disabled={!completable}>
                    {activeStep === steps.length - 1 ? t("finish") : t("next")}
                    <KeyboardArrowRight/>
                </Button>
            }
            backButton={
                <Button size="small" onClick={handleBack} disabled={activeStep === 0}
                        sx={{ ...(activeStep === 0 ? { visibility: "hidden"} : {})}}>
                    <KeyboardArrowLeft/>
                    {t("back")}
                </Button>
            }
        />
    </Layout>
}

export default Onboarding;
