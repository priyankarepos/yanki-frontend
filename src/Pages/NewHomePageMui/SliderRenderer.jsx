import { NewHomePageSlider, NewHomePageMuiMobile, HomeMainDescription } from "./HomePageSlider";
import { PersonalAssistantDescription, PersonalAssistantMuiMobile, PersonalAssistantSlider } from "./PersonaAssistentSlider";
import { DirectoryDescription, DirectoryMuiMobile, DirectorySlider } from "./DirectoryPromtsSlider";
import { LibraryDescription, LibraryMuiMobile, LibrarySlider } from "./LibraryPromtsSlider";
import { MyzmanimDescription, MyzmanimMuiMobile, MyzmanimSlider } from "./myzmanimPromptsSlider";
import { GoDavenDescription, GoDavenMuiMobile, GoDavenSlider } from "./GoDavenPromptsSlider";
import { TorahAnytimeDescription, TorahanytimeMuiMobile, TorahanytimeSlider } from "./TorahanytimeSlider";
import { IsItKosherDescription, IsItKosherimeMuiMobile, IsItKosherSlider } from "./IsItKosherSlider";
import { MikvahDescription, MikvahMuiMobile, MikvahSlider } from "./MikvahSLider";
import { sourceSelectionStrings } from "../../Utils/stringConstant/stringConstant";
export const SliderRenderer = ({ selectedOption, activeTab, t, handleQuestionClick }) => {
    switch (selectedOption) {
        case sourceSelectionStrings.yankeeDirectory:
            return <DirectorySlider activeTab={activeTab} t={t} handleQuestionClick={handleQuestionClick} />;
        case sourceSelectionStrings.yankeeLibrary:
            return <LibrarySlider activeTab={activeTab} t={t} handleQuestionClick={handleQuestionClick} />;
        case sourceSelectionStrings.myZmanim:
            return <MyzmanimSlider activeTab={activeTab} t={t} handleQuestionClick={handleQuestionClick} />;
        case sourceSelectionStrings.goDaven:
            return <GoDavenSlider activeTab={activeTab} t={t} handleQuestionClick={handleQuestionClick} />;
        case sourceSelectionStrings.torahAnytime:
            return <TorahanytimeSlider activeTab={activeTab} t={t} handleQuestionClick={handleQuestionClick} />;
        case sourceSelectionStrings.isItKosher:
            return <IsItKosherSlider activeTab={activeTab} t={t} handleQuestionClick={handleQuestionClick} />;
        case sourceSelectionStrings.mikvah:
            return <MikvahSlider activeTab={activeTab} t={t} handleQuestionClick={handleQuestionClick} />;
        case sourceSelectionStrings.personalAssistant:
            return <PersonalAssistantSlider activeTab={activeTab} t={t} handleQuestionClick={handleQuestionClick} />;
        default:
            // YankiAIChoice is the default option
            return <NewHomePageSlider activeTab={activeTab} t={t} handleQuestionClick={handleQuestionClick} />;
    }
};

export const MobileSliderRenderer = ({ selectedOption, activeTab, t, handleQuestionClick }) => {
    switch (selectedOption) {
        case sourceSelectionStrings.yankeeDirectory:
            return <DirectoryMuiMobile activeTab={activeTab} t={t} handleQuestionClick={handleQuestionClick} />;
        case sourceSelectionStrings.yankeeLibrary:
            return <LibraryMuiMobile activeTab={activeTab} t={t} handleQuestionClick={handleQuestionClick} />;
        case sourceSelectionStrings.myZmanim:
            return <MyzmanimMuiMobile activeTab={activeTab} t={t} handleQuestionClick={handleQuestionClick} />;
        case sourceSelectionStrings.goDaven:
            return <GoDavenMuiMobile activeTab={activeTab} t={t} handleQuestionClick={handleQuestionClick} />;
        case sourceSelectionStrings.torahAnytime:
            return <TorahanytimeMuiMobile activeTab={activeTab} t={t} handleQuestionClick={handleQuestionClick} />;
        case sourceSelectionStrings.isItKosher:
            return <IsItKosherimeMuiMobile activeTab={activeTab} t={t} handleQuestionClick={handleQuestionClick} />;
        case sourceSelectionStrings.mikvah:
            return <MikvahMuiMobile activeTab={activeTab} t={t} handleQuestionClick={handleQuestionClick} />;
        case sourceSelectionStrings.personalAssistant:
            return <PersonalAssistantMuiMobile activeTab={activeTab} t={t} handleQuestionClick={handleQuestionClick} />;
        default:
            return <NewHomePageMuiMobile activeTab={activeTab} t={t} handleQuestionClick={handleQuestionClick} />;
    }
};


export const MainDescriptionRenderer = ({ selectedOption, activeTab }) => {
    switch (selectedOption) {
        case sourceSelectionStrings.yankeeDirectory:
            return <DirectoryDescription />;
        case sourceSelectionStrings.yankeeLibrary:
            return <LibraryDescription />;
        case sourceSelectionStrings.myZmanim:
            return <MyzmanimDescription />;
        case sourceSelectionStrings.goDaven:
            return <GoDavenDescription />;
        case sourceSelectionStrings.torahAnytime:
            return <TorahAnytimeDescription />;
        case sourceSelectionStrings.isItKosher:
            return <IsItKosherDescription />;
        case sourceSelectionStrings.mikvah:
            return <MikvahDescription />;
        case sourceSelectionStrings.personalAssistant:
            return <PersonalAssistantDescription />;
        default:
            return <HomeMainDescription activeTab={activeTab} />;
    }
};