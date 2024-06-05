import { configureStore } from '@reduxjs/toolkit'
import dashReducer from './imagesSlice'
import wikiReducer from './wikiSlice'
import userReducer from './userSlice'
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux'
// import { localStoreMiddleware } from './middlewares/localstore-middleware'

export const store = configureStore({
    reducer: {
        images: dashReducer,
        wikipedia: wikiReducer,
        user: userReducer,
    },
    // middleware: (gDM) => gDM().concat(localStoreMiddleware),
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch

export const useAppDispatch = () => useDispatch<AppDispatch>()
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector
