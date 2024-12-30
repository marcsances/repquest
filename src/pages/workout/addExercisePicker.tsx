/*
    This file is part of WeightLog.

    WeightLog is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    WeightLog is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with WeightLog.  If not, see <https://www.gnu.org/licenses/>.
 */
import React, {useContext, useEffect, useState} from "react";
import {Dialog} from "@mui/material";
import {WorkoutPicker} from "../workout-list/workoutPicker";
import {Workout, WorkoutExercise} from "../../models/workout";
import {DBContext} from "../../context/dbContext";
import Loader from "../../components/Loader";
import {Exercise, ExerciseTag} from "../../models/exercise";
import {ExerciseList} from "../workout-editor/exercise_list";
import getId from "../../utils/id";
import {WorkoutExerciseEditor} from "../workout-editor/workoutExercise_editor";
import {WorkoutContext} from "../../context/workoutContext";
import {compareSetHistoryEntries} from "../../utils/comparators";

enum PickerSteps {
    LOADING,
    SELECT_WORKOUT,
    SELECT_EXERCISE,
    CONFIGURE_SETS
}

interface AddExercisePickerProps {
    usingExercise?: Exercise;
    replacingExercise?: boolean;
    onClose: (completed: boolean) => void;
}

const AddExercisePicker = ({onClose, replacingExercise, usingExercise}: AddExercisePickerProps) => {
    const [step, setStep] = useState<PickerSteps>(replacingExercise ? PickerSteps.LOADING : PickerSteps.SELECT_WORKOUT);const [exercisesFilter, setExercisesFilter] = useState<Exercise[] | undefined>(undefined);
    const [exercisesTags, setExercisesTags] = useState<ExerciseTag[] | undefined>(undefined);
    const [workoutExercise, setWorkoutExercise] = useState<WorkoutExercise | undefined>(undefined);
    const {db} = useContext(DBContext);
    const {addExercise, replaceExercise, focusedExercise} = useContext(WorkoutContext);

    useEffect(() => {
        if (replacingExercise) {
            setExercisesTags(focusedExercise ? focusedExercise?.tags.filter((it) => it >= ExerciseTag.CHEST) : []);
            setStep(PickerSteps.SELECT_EXERCISE);
        }
        if (usingExercise) {
            onSelectExercise(usingExercise).then();
        }
    }, [replacingExercise]);

    const onSelectWorkout = (workout: Workout) => {
        if (!db) return;
        setStep(PickerSteps.LOADING);
        db.workout.get(workout.id).then((workout) => {
            if (!workout) return;
            db.workoutExercise.bulkGet(workout.workoutExerciseIds).then((wes) => {
                db.exercise.bulkGet(wes.filter((it) => !!it).map((it) => it!.exerciseId)).then((exercises) => {
                    if (!exercises) return;
                    setExercisesFilter(exercises.filter((it) => !!it).map((it) => it!));
                    setStep(PickerSteps.SELECT_EXERCISE);
                });
            })
        })
    };

    const onFreePicked = () => {
        setStep(PickerSteps.SELECT_EXERCISE);
    }

    const onSelectExercise = async (exercise: Exercise) => {
        setStep(PickerSteps.LOADING);
        if (!db) return;
        let we: WorkoutExercise = {
            id: getId(),
            exerciseId: exercise.id,
            setIds: [],
            initial: true
        };
        if (we.setIds.length === 0) {
            // let's try to get the last sets from the history
            const sets = (await db.exerciseSet
                .where("exerciseId")
                .equals(exercise.id)
                .toArray())
                .sort(compareSetHistoryEntries);
            if (sets.length > 0) {
                // duplicate the last set and preload it
                const setid = getId();
                db.exerciseSet.put({...sets[0], id: setid});
                we.setIds = [setid];
            }
        }
        await db.workoutExercise.put(we);
        setWorkoutExercise(we);
        setStep(PickerSteps.CONFIGURE_SETS);
    };

    const onWorkoutExerciseConfigured = (workoutExercise: WorkoutExercise) => {
        if (!replacingExercise && addExercise) addExercise(workoutExercise);
        if (replacingExercise && replaceExercise) replaceExercise(workoutExercise);
        onClose(true);
    }

    return <Dialog fullScreen open={true}>
        {step === PickerSteps.LOADING && <Loader/>}
        {step === PickerSteps.SELECT_WORKOUT && <WorkoutPicker onSelectWorkout={onSelectWorkout} onFreePicked={onFreePicked} onCancel={() => onClose(false)}/>}
        {step === PickerSteps.SELECT_EXERCISE && <ExerciseList onSelectExercise={(e) => {
            onSelectExercise(e).then();
        }} options={exercisesFilter} tags={exercisesTags} onBack={!replacingExercise ? () => { setExercisesFilter(undefined); setStep(PickerSteps.SELECT_WORKOUT)} : undefined} onCancel={replacingExercise ? () => onClose(false) : undefined}/>}
        {step === PickerSteps.CONFIGURE_SETS && <WorkoutExerciseEditor workoutExerciseId={workoutExercise?.id} onDismiss={onWorkoutExerciseConfigured} onBack={() => setStep(PickerSteps.SELECT_EXERCISE)} />}
    </Dialog>
};

export default AddExercisePicker;
